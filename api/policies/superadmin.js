/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
 /**
 * Allow only super admin
 */
module.exports = function (req, res, ok) {

  // User is allowed, proceed to controller

  //THIS DOES NOT SEEM TO WORK FOR WEBSOCKET CONNECTIONS

  //console.log(req.session.passport.user);
  if (req.session.passport && req.session.passport.user && _.contains(sails.config.admin_email,req.session.passport.user.profile.emails[0].value)) {
    //console.log("logging in");
    return ok();
  }
  else {// User is not allowed
  	if (req.wantsJSON)
  	{
      //console.log("no in json");
    	return res.status(403).send("You are not permitted to perform this action.");
    }
    else
    {
    	req.session.flash = {msg:req.__('No can do, sorry.')};
      //console.log("not authorized");
    	return res.redirect('auth/login');
    }
  }
};
