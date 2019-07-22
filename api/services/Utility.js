/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
/**
* Module dependencies
*/
const util = require('util'),
  _ = require('lodash');
const sharp = require('sharp');
const path = require('path');
const moment = require('moment');
const cloudfront = require('aws-cloudfront-sign');
const fs = require('fs');
const uuid = require('uuid');

const request = require('request');

module.exports = {

  generateRoleMap: async function (event, callback) {

    event.eventtype.roleimg = `${uuid.v1()}${event.id}_roleimg.png`;

    let img = sharp({
      create: {
        width: 600,
        height: 600,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    });

    let y = 0;
    let x = 0;
    let index = 0;

    try {
      //get all the files:
      for (let role of event.eventtype.roles) {

        x = 20 + ((index % 2) * 300);
        y = (index * (600 / event.eventtype.roles.length));
        event.eventtype.roles[index].position = [x/600.0,y/600.0];
        index++;

        if (role.image) {

          let ff = path.join(__dirname, '..', '..', 'upload', role.image);
          if (!sails.config.LOCALONLY)
          {
            var options = {
              keypairId: sails.config.CLOUDFRONT_KEY,
              privateKeyPath: sails.config.CLOUDFRONT_KEYFILE,
              expireTime: moment().add(1, 'day')
            }
            var signedUrl = cloudfront.getSignedUrl(`${sails.config.S3_CLOUD_URL}/${role.image}`, options);
            
            // console.log(signedUrl);

            await new Promise(function(resolve,reject){

              // console.log(ff);
              let stream = request(signedUrl).pipe(fs.createWriteStream(ff));
              stream.on('finish', function () { resolve(); });
              // console.log(resp);
              
              // fs.writeFileSync(ff,resp);
            });
            // fs.createWriteStream(ff));
          }

          // console.log('getting here')

          // console.log(ff);
          
          let sub = await sharp(ff).resize(200).toBuffer();

          

          let tmpimg = await img.overlayWith(sub, { top: y, left: x }).png().toBuffer()
          img = sharp(tmpimg);
        }
        
      }
    } catch (error) {
      console.log(error);
    }

    img.png().toFile(path.join(__dirname, '..', '..', 'upload', event.eventtype.roleimg), function (err) {
      console.log(err);
      
      callback(event);
    });
  },

  getRequestAction: function (req) {
    if (req.options.action) return req.options.action;

    var controller = req.options.controller || req.options.model;

    var baseRoute = sails.config.blueprints.prefix + controller;
    var requestRoute = req.route.method + ' ' + req.route.path;

    var Model = sails.models[controller];

    if (req.options.shortcuts && Model) {
      var shortcutRoutes = {
        '/%s/find/:id?': 'find',
        '/%s/create': 'create',
        '/%s/update/:id?': 'update',
        '/%s/destroy/:id?': 'destroy'
      };

      var shortcutAction = _.findWhere(shortcutRoutes, function (blueprint, pattern) {
        var shortcutRoute = util.format(pattern, baseRoute);
        return req.route.path === shortcutRoute;
      });

      if (shortcutAction) return shortcutAction;
    }

    if (req.options.rest && Model) {
      var restRoutes = {
        'get /%s/:id?': 'find',
        'post /%s': 'create',
        'put /%s/:id?': 'update',
        'delete /%s/:id?': 'destroy'
      };

      var restAction = _.findWhere(restRoutes, function (blueprint, pattern) {
        var restRoute = util.format(pattern, baseRoute);
        return requestRoute === restRoute;
      });

      if (restAction) return restAction;

      var associationActions = _.compact(_.map(req.options.associations, function (association) {
        var alias = association.alias;

        var associationRoutes = {
          'get /%s/:parentid/%s/:id?': 'populate',
          'post /%s/:parentid/%s': 'add',
          'delete /%s/:parentid/%s': 'remove'
        };

        return _.findWhere(associationRoutes, function (blueprint, pattern) {
          var associationRoute = util.format(pattern, baseRoute, alias);
          return requestRoute === associationRoute;
        });
      }));

      if (associationActions.length > 0) return associationActions[0];
    }
  }
};