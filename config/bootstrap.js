/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");

module.exports.bootstrap = function (cb) {
  //start http redirect server:
  //   var request = require("request");

  //   var myIP = require("my-ip");

  sails.winston = require("winston");
  sails.winston.remove(sails.winston.transports.Console);
  sails.winston.add(sails.winston.transports.Console, {
    colorize: true,
    level: "info",
  });
  require("winston-mongodb").MongoDB;
  sails.winston.add(sails.winston.transports.MongoDB, {
    level: "verbose",
    db: sails.config.connections.mongodb.url,
    collection: "log",
    storeHost: true,
    //handleExceptions: true
  });

  //check variables are set:
  if (sails.config.google_clientid == "googleid") {
    Log.error("config", "*** Enter Google OAuth Details in .sailsrc ***");
    throw new Error("OAuth Config Error");
  }

  //console.log(sails.config.admin_email);

  //check admin emails:
  if (sails.config.admin_email.length == 0) {
    Log.error("config", "*** Add a super admin email address in .sailsrc ***");
    throw new Error("No Admin Email Address Set");
  }

  fs.exists("./package.json", function (yes) {
    if (yes) {
      let myversion = require("../package.json");
      sails.config.version = myversion.version;
    }
  });

  fs.exists("../ourstory-worker/package.json", function (yes) {
    if (yes) {
      let myversion = require("../../ourstory-worker/package.json");
      sails.config.workerversion = myversion.version;
    }
  });

  // if (fs.existsSync('../../ourstory-worker/package.json'))
  // {
  // 	let workerversion = require('../../ourstory-worker/package.json');
  // 	sails.config.workerversion = workerversion.version;
  // }

  // //SETS UP STATIC EDITION JSON:
  // fs.writeFile("assets/landing/public/edition.json", JSON.stringify({
  // 	"name":sails.config.name,
  // 	"android":sails.config.PLAYLINK,
  // 	"ios":sails.config.IOSLINK,
  // 	"bootlegger":sails.config.bootlegger,
  // 	"ifrc":sails.config.ifrc
  // }), function(err) {
  // 	Log.info('bootstrap', "Edition file updated");
  // });

  Log.info(
    "bootstrap",
    "Connected to MongoDB on " + sails.config.connections.mongodb.url
  );

  //sails.winston.remove(sails.winston.transports.Console);
  // Log.info('bootstrap', 'started', { local: sails.config.LOCALONLY });

  // // insert default settings:
  // Settings.findOne({name:'processedits'}).exec(function(err,data){
  // 	// console.log(data);
  // 	if (!data)
  // 	{
  // 		Settings.create({ name: 'processedits',value:false }).exec(function(){
  // 			Log.info('bootstrap', 'Added Init Settings', { local: sails.config.LOCALONLY });
  // 		});
  // 	}
  // });

  /**
   * GDPR User Sanitisation
   */

  User.native(function (err, collection) {
    collection.update(
      {},
      {
        $unset: {
          "profile.gender": true,
          "profile._json": true,
          "profile._raw": true,
        },
      },
      {
        multi: true,
      },
      function (err) {
        // console.log(err);
        Log.info("bootstrap", "Unset Extra User Data");
      }
    );
  });

  Event.native(function (err, collection) {
    collection.update(
      {},
      {
        $unset: {
          apikey: true,
        },
      },
      {
        multi: true,
      },
      function (err) {
        // console.log(err);
        Log.info("bootstrap", "Unset Event API Key");
      }
    );
  });

  if (sails.config.LOCALONLY) Log.info("bootstrap", `Loading LOCAL_MODE`);

  /**
   * When in demo mode, clear out content older than 48h
   */
  if (sails.config.DEMOMODE) {
    //set timer to check if events need to be cleared:

    //every 5 mins:

    setInterval(async () => {
      const now = Date.now();
      const before = now - 48 * 60 * 60 * 1000;
      //get all events where createdAt time < now - 48h
      //   console.log("EVENTS:");
      const events = await Event.find({
        createdAt: {
          "<": new Date(before),
        },
      });

      //   console.log(events);
      for (const event of events) {
        console.log(`Removing upload/${event.id}`);
        await fse.remove(path.join(__dirname, "..", "upload", event.id));
        //remove all files in upload folder under this key (+transcode):
        console.log(`Removing upload/transcode/${event.id}`);
        await fse.remove(
          path.join(__dirname, "..", "upload/transcode", event.id)
        );

        //list all edits from this event:
        const edits = await Edits.find({ "media.0.event_id": event.id });
        //for each edit, remove (+transcode)

        for (const edit of edits) {
          console.log(`Removing upload/edits/${edit.shortcode}*.mp4`);
          await fse.remove(
            path.join(
              __dirname,
              "..",
              "upload",
              "edits",
              edit.shortcode,
              "*.mp4"
            )
          );
          await fse.remove(
            path.join(
              __dirname,
              "..",
              "upload",
              "trancode",
              "edits",
              edit.shortcode,
              "*.mp4"
            )
          );
          await Edits.destroy(edit.id);
        }
        await Event.destroy(event.id);
      }
    }, 5 * 60 * 1000); //every 5 mins
  }

  /**
   * Update edit records if the edit file exists:
   */

  //if we are in online mode -- update .hasoriginal and .hastagged if there is a .path in the object.
  if (sails.config.LOCALONLY) {
    //if we are in offline mode -- update .hasoriginal and .hastagged if the files exist
    Edits.find({}).exec(function (err, edits) {
      Log.error(err);
      for (var edit of edits) {
        // console.log(edit);
        if (edit.path && edit.code) {
          // console.log(path.join(__dirname,'..',"upload","edits",edit.code)+".mp4");
          if (
            fs.existsSync(
              path.join(__dirname, "..", "upload", "edits", edit.code) + ".mp4"
            )
          ) {
            edit.hasoriginal = true;
          } else {
            edit.hasoriginal = false;
          }

          if (
            fs.existsSync(
              path.join(__dirname, "..", "upload", "edits", edit.code) +
                "_tags.mp4"
            )
          ) {
            edit.hastagged = true;
          } else {
            edit.hastagged = false;
          }

          if (
            fs.existsSync(
              path.join(__dirname, "..", "upload", "edits", edit.code) +
                "_hq.mp4"
            )
          ) {
            edit.hashighquality = true;
          } else {
            edit.hashighquality = false;
          }

          edit.save();
        }
      }
    });
  } else {
    Edits.native(function (err, collection) {
      collection.update(
        {},
        {
          $set: {
            hasoriginal: true,
            hastagged: true,
          },
        },
        {
          multi: true,
        },
        function (err) {
          // console.log(err);
          Log.info("bootstrap", "Setting hasoriginal and hastagged");
        }
      );
    });
  }

  /**
   * FIRST INSTALL SCRIPTS
   */
  try {
    Shot.find({}).exec(function (err, shots) {
      // sails.log.error(err);
      if (shots) {
        if (shots.length == 0) {
          Shot.create(JSON.parse(fs.readFileSync("assets/allshots.json"))).exec(
            function (err, done) {
              Log.info("bootstrap", "Init Shots");
            }
          );
        } else {
          _.each(shots, function (s) {
            //console.log('assets/data/images/'+s.image);
            if (!fs.existsSync("data/images/" + s.image)) {
              Log.error("bootstrap", "Missing Large " + s.image);
            }

            if (!fs.existsSync("data/icons/" + s.icon)) {
              Log.error("bootstrap", "Missing Small " + s.icon);
            }
          });
        }
      }
    });

    EventTemplate.find({}).exec(function (err, evs) {
      if (evs) {
        if (evs.length == 0) {
          EventTemplate.create(
            JSON.parse(fs.readFileSync("assets/alltemplates.json"))
          ).exec(function (err, done) {
            Log.info("bootstrap", "Init Templates");
          });
        }
      }
    });

    if (sails.config.LOCALONLY) {
      Whitelabel.find({}).exec(function (err, wl) {
        // console.log(wl);
        if (wl.length == 0) {
          Whitelabel.create({
            name: "Offline",
            codename: "offline",
            redirect_prot: "offline",
          }).exec((err) => {
            Log.info("bootstrap", "Added offline WhiteLabel config");
          });
        }
      });
    }
  } catch (e) {
    Log.error(e);
  }

  /**
   * END INSTALL SCRIPTS
   */

  //start passport authentication
  var passport = require("passport");
  var GoogleStrategy = require("passport-google-oauth20").Strategy;
  var LocalStrategy = require("passport-local").Strategy;

  passport.use(
    new LocalStrategy({ passReqToCallback: true }, function (
      req,
      username,
      password,
      done
    ) {
      // User.findOne({
      // 	username: username,
      // 	password: password
      // }, function (err, user) {
      // 	return done(err, user);
      // });
      // console.log('processing local');
      if (sails.config.LOGINCODE == "") {
        // console.log('NO LOGIN CODE')
        // req.session.flash = {msg:'NO LOGINCODE set!'};
        return done(req.__("No Local Login Code Set"), null);
      }

      if (password == sails.config.LOGINCODE) {
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
            return done(err, user);
          }
        );
      } else {
        // req.session.flash = {msg:'Login Code Incorrect!'};
        return done(req.__("Invalid Local Login Code"), null);
      }
    })
  );

  var protocol = _.contains(process.argv, "--prod") ? "https" : "http";

  if (!sails.config.LOCALONLY || sails.config.DEMOMODE) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: sails.config.google_clientid,
          clientSecret: sails.config.google_clientsecret,
          callbackURL: sails.config.master_url + "/auth/google_return",
        },
        function (token, tokensecret, profile, done) {
          //console.log(profile);
          // profile._json.picture = profile.photos[0].value.replace('?sz=50', '');
          var sn_profile = {
            id: profile.id,
            displayName: profile.displayName,
            provider: profile.provider,
            photos: [
              {
                value: profile.photos[0].value,
              },
            ],
            emails: [
              {
                value: profile.emails[0].value,
              },
            ],
          };

          // console.log(sn_profile);

          User.findOrCreate(
            { uid: String(profile.id) },
            { uid: String(profile.id), profile: sn_profile }
          ).exec(function (err, user) {
            // console.log(user);
            Log.info("google", "Login", { user_id: profile.id });

            user.profile.photos = sn_profile.photos;
            user.save(function (err) {
              return done(err, user);
            });
          });
        }
      )
    );
  }

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  //startup the event manager:
  sails.hostname = sails.config.hostname + ":" + sails.config.port;
  sails.multiserveronline = false;
  sails.eventmanager = require("./eventmanager.js");
  sails.eventmanager.init(sails, function () {
    cb();
  });
};
