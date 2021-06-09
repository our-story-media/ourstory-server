/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
/**
 * Check edit access
 */

function checkServerCode(req, res, cb) {
  if (req.session.passport && req.session.passport.user)
    cb(req.session.passport.user.id);
  else cb(null);
}

module.exports = function (req, res, ok) {
  var id = req.param("id");

  checkServerCode(req, res, function (user) {
    //var user = req.session.passport.user.id;

    //if titan
    if (
      sails.config.LOCALONLY &&
      (req.header("host") == "localhost" ||
        (req.header("Referer") != null
          ? req.header("Referer").startsWith("http://localhost") ||
            req.header("Referer").startsWith("http://offline.bootlegger.tv")
          : false))
    )
      return ok();

    //if not logged in
    if (!id || !user) return res.notFound();

    // //if administrator
    if (
      req.session.passport &&
      req.session.passport.user &&
      _.contains(
        sails.config.admin_email,
        req.session.passport.user.profile.emails[0].value
      )
    )
      return ok();

    Edits.findOne(id, function (err, edit) {
      if (edit) {
        // console.log(edit.media[0].event_id);
        //if the user created the media:
        if (edit.user_id == user) return ok();

        Event.findOne(edit.media[0].event_id, function (err, shoot) {
          if (!err && shoot) {
            // console.log(user);
            //if the user is admin on the shoot for the media
            if (_.contains(shoot.ownedby, user)) return ok();
          }
          return res.notFound();
        });
      } else {
        return res.notFound();
      }
    });
  });
};
