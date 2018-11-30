/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
// EmailService.js - in api/services

// var nodemailer = require('nodemailer');
// var directTransport = require('nodemailer-direct-transport');
// var transporter = nodemailer.createTransport(directTransport());
var sendgrid;
if (!sails.config.LOCALONLY) {
    sendgrid = require('@sendgrid/mail');
    sendgrid.setApiKey(sails.config.email.SENDGRID_ID);
    sendgrid.setSubstitutionWrappers("{{", "}}");
}
var moment = require('moment');

exports.sendEmail = function (options) {

    if (!sails.config.LOCALONLY) {
        // console.log(options);
        var email = {
            personalizations:[{
                to: {
                    email: options.to
                },
                dynamic_template_data: {
                    "sentat": moment().format('HH:mm'),
                    "senton": moment().format('ddd Do MMM'),
                    "url": sails.config.master_url,
                    "btnurl": options.btnurl,
                    "btntext": options.btntext,
                    "name": options['name'],
                    "body":options.content,
                    "subject":options.subject
                }
            }],
            from: {
                email: "info@ourstory.video",
                name: 'Our Story'
            },
            subject: options.subject,
            content:[
                {
                    type:'text/html',
                    value: options.content
                }],
            templateId: sails.config.email.SENDGRID_TEMPLATE
        };

        // console.log(email);

        sendgrid.send(email)
        .then(function () {
            console.log("SENT");
            // console.log(json);
            Log.info('Email Sent', email)
            // console.log(json);
        })
        .catch((err)=>{
            console.log("ERROR");
            Log.error('Email Not Sent', email, err);
        });
    }
};

exports.newUser = function (user) {
    //open app??
    if (user.profile.emails[0].value) {
        var options = {
            to: user.profile.emails[0].value,
            name: user.profile.displayName,
            subject: 'Welcome to Our Story',
            content: "Welcome to Our Story. We are here to help you contribute to great video stories.",
            btnurl: sails.config.master_url,
            btntext: "Get Started Now"
        };
        exports.sendEmail(options);
    }
};

exports.joinInvite = function (email, eventid, newcode) {
    Event.findOne(eventid).exec(function (err, ev) {
        var options = {
            to: email,
            name: 'Friend!',
            subject: 'Invite to Contribute',
            content: 'You have been invited to contribute to the Our Story project ' + ev.name + ".",
            btnurl: sails.config.master_url + "/join/" + newcode,
            btntext: "Login to Contribute"
        }
        exports.sendEmail(options);
    });
};
