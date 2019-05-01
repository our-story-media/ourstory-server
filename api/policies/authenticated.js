/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
 /**
 * Allow any authenticated user.
 */

function isValidReferer(req)
{
  console.log(req.header('host'));
  // return true;
  return req.header('host') == 'localhost';
}

module.exports = function (req, res, ok) {

  //check its from localhost:
  if (sails.config.LOCALONLY && isValidReferer(req))
  {
    //check its not from mobile:
    // console.log(req.headers);

    console.log('IS VALID LOCAL ADMIN');
    
    req.session.api = false;
		req.session.ismobile = true;
    req.session.isios = true;
    // res.locals.rtl = false;
		User.findOrCreate({
      localadmin:true
    },
    {
      localadmin:true,
      consent: new Date(),
      nolimit:1,
      profile: {
        displayName: sails.__('Director'),
        provider: 'local',
        photos: [
          {
            value: sails.config.master_url + '/images/user.png'
          }
        ],
        emails: [
          {
            value: 'localadmin@bootlegger.tv'
          }
        ]
      }
    }, function (err, user) {
      req.session.passport.user = user;
			// req.logIn(user, function (done) {
        return ok();
			// });
		});
  }
  else
  {
    // console.log('NOT LOCAL');
    
    //if the request has a servertoken (i.e. its operating on behalf of another user...)
    if (req.param('servertoken'))
    {
      //has a server token
      User.findOne({'apikey.servertoken':req.param('servertoken')}).exec(function(err,user){
        if (user)
        {
          //do headless login using this user:
          req.session.passport.user = user;
          return ok();
        }
        else
        {
          return res.json(403,{msg:"Invalid server token"});
        }
      });
    }
    else
    {

    // User is allowed, proceed to controller
    if (req.session.passport && req.session.passport.user) {

      // console.log(req.session.passport.user);
      // console.log('redirect ' + req.options.action);
      // console.log(req.session.passport.user);
      
      // if (req.session.passport.user.profile.provider == 'local' && req.options.action != 'sessionkey')
      // {
      //   return res.redirect('/auth/sessionkey');
      // }

      if (req.options.action=='acceptconsent' || req.options.action=='consent')
      {
        // console.log("accept or consent");
        return ok();
      }
      else
      {
        //GDPR adjustments:
        if (!req.session.passport.user.consent )
        {
          if (req.wantsJSON)
          {
            return res.status(500).json({
              msg:'Privacy consent required'
            })
          }
          else
          {
            //send to consent:
            return res.redirect('/consent');
          }
        }
        else
        {
          return ok();
        }
      }
    }
    else {
      // User is not allowed

        if (req.wantsJSON)
        {
          return res.json(403,{msg:"You are not permitted to perform this action."});
        }
        else
        {
          req.session.flash = {msg:sails.__('No can do, sorry.')};
          //console.log("not authorized");
          return res.redirect('auth/login');
        }
      }
    }
  }
};