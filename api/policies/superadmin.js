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
  if (
    req.session.passport &&
    req.session.passport.user &&
    _.contains(
      sails.config.admin_email,
      req.session.passport.user.profile.emails[0].value
    )
  ) {
    //console.log("logging in");
    return ok();
  } else {
    // User is not allowed
    if (req.wantsJSON) {
      // console.log("no in json");
      if (
        req.session.passport &&
        req.session.passport.user &&
        sails.config.DEMOMODE
      )
        return ok();
      else
        return res
          .status(403)
          .send("You are not permitted to perform this action.");
    } else {
      //if its demo mode:
      if (
        req.session.passport &&
        req.session.passport.user &&
        sails.config.DEMOMODE
      )
        return ok();

      req.session.flash = { msg: req.__("No can do, sorry.") };
      //console.log("not authorized");
      return res.redirect("auth/login");
    }
  }
};
