/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
/**
 * Allow any authenticated user.
 */

function isValidReferer(req) {
  //FOR DEBUGGING!
  // return false;
  if (sails.config.DEMOMODE) return true;

  return (
    _.startsWith(req.header("host"), "localhost") ||
    _.includes(req.header("referer"), "localhost")
  );
}

module.exports = function (req, res, ok) {
  //check its from localhost:
  // console.log(isValidReferer(req));
  if (sails.config.LOCALONLY && isValidReferer(req) && !sails.config.DEMOMODE) {
    //check its not from mobile:
    // console.log(req.headers);

    // console.log("IS VALID LOCAL ADMIN");

    req.session.api = false;
    req.session.ismobile = true;
    req.session.isios = true;
    // res.locals.rtl = false;
    User.findOrCreate(
      {
        localadmin: true,
      },
      {
        localadmin: true,
        consent: new Date(),
        nolimit: 1,
        profile: {
          displayName: req.__("Director"),
          provider: "local",
          photos: [
            {
              value: sails.config.master_url + "/images/user.png",
            },
          ],
          emails: [
            {
              value: "localadmin@indaba.dev",
            },
          ],
        },
      },
      function (err, user) {
        req.session.passport.user = user;
        // console.log(err)
        // req.logIn(user, function (done) {
        return ok();
        // });
      }
    );
  } else {
    //if the request has a servertoken (i.e. its operating on behalf of another user...)
    if (req.param("servertoken")) {
      //has a server token
      User.findOne({ "apikey.servertoken": req.param("servertoken") }).exec(
        function (err, user) {
          if (user) {
            //do headless login using this user:
            req.session.passport.user = user;
            return ok();
          } else {
            return res.json(403, { msg: "Invalid server token" });
          }
        }
      );
    } else {
      // console.log("CHECKING USER");

      // User is allowed, proceed to controller
      if (req.session.passport && req.session.passport.user) {
        // console.log("has user");

        if (
          req.options.action == "acceptconsent" ||
          req.options.action == "consent"
        ) {
          return ok();
        } else {
          //GDPR adjustments:
          if (!req.session.passport.user.consent && !sails.config.DEMOMODE) {
            if (req.wantsJSON) {
              return res.status(500).json({
                msg: "Privacy consent required",
              });
            } else {
              //send to consent:
              return res.redirect("/consent");
            }
          } else {
            return ok();
          }
        }
      } else {
        // User is not allowed
        // console.log('not allowed')
        // console.log(req.session);
        if (req.wantsJSON) {
          // console.log('forbidden');
          return res
            .status(403)
            .json({ msg: "You are not permitted to perform this action." });
        } else {
          if (sails.config.LOCALONLY && isValidReferer(req)) {
            console.log("STEP 1");
            req.session.flash = { msg: req.__("No can do, sorry.") };
            //console.log("not authorized");
            return res.redirect("auth/login");
          } else {
            //send to Local Code Login:
            console.log("STEP 2");

            res.locals.localmode = sails.localmode;
            res.locals.inspect = require("util").inspect;
            res.locals.moment = require("moment");
            res.locals.user = "";
            res.locals.rtl = "ltr";
            if (!res.locals.flash) res.locals.flash = "";

            if (!res.locals.event) {
              res.locals.event = { name: "" };
            }

            // console.log(req.session.flash);
            // res.locals.flash = req.session.flash;
            return res.status(403).view("notlocal");
          }
        }
      }
    }
  }
};
