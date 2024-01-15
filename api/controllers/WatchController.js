/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
/**
 * LogController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

const moment = require("moment");
const cloudfront = require("aws-cloudfront-sign");
const music = require("../../config/music.json");

var editprogresses = {};

function checkStatus(edit) {
  setTimeout(function () {
    var ed = edit;
    process.nextTick(function () {
      //db query
      Edits.findOne(ed).exec(function (err, edd) {
        if (typeof editprogresses[edit] == "undefined")
          editprogresses[edit] = -1;

        if (
          err ||
          typeof edd == "undefined" ||
          (edd.progress && edd.progress > 98) ||
          edd.fail
        ) {
          //cancel the timer
          if (edd) Edits.publishUpdate(edd.id, { edit: edd });
          //console.log('timer cancelled');
        } else {
          if (
            typeof edd.progress != "undefined" &&
            editprogresses[edit] != edd.progress
          ) {
            //console.log(editprogresses[edit] + ' and ' + edd.progress);
            editprogresses[edit] = edd.progress;
            //console.log('updated with '+edd.progress);
            //pump update to socket
            Edits.publishUpdate(edd.id, { edit: edd });
          }
          checkStatus(edd.id);
        }
      });
    });
  }, 5000);
}

module.exports = {
  index: function (req, res) {
    //list my shoots, and also any edits that I have made:
    return res.view();
  },

  edits: function (req, res) {
    //list all edits for a shoot:
    Event.findOne(req.params.id, function (err, ev) {
      if (ev)
        return res.view({
          theevent: ev,
          event: ev,
          pagetitle: req.__("Stories for "),
        });
      else return res.redirect("/dashboard");
    });
  },

  mymedia: function (req, res) {
    Edits.find({ user_id: req.session.passport.user.id }).exec(function (
      err,
      edits
    ) {
      Media.find({ created_by: req.session.passport.user.id }).exec(function (
        err,
        media
      ) {
        var grouped = _.groupBy(media, "event_id");
        //group by shoot
        var shoots = _.keys(grouped);
        //	console.log(shoots);
        Event.find(shoots).exec(function (err, events) {
          var keep = events;

          Media.find({ event_id: shoots }).exec(function (err, allmedia) {
            var allmedia_grouped = _.groupBy(allmedia, "event_id");

            var regrouped = [];
            var plucked = _.pluck(keep, "id");
            _.each(grouped, function (val, key) {
              if (_.contains(plucked, key)) {
                var ev = _.find(keep, { id: key });
                //combine with more media if public view allowed:

                if (ev.publicview)
                  ev.media = _.merge(val, allmedia_grouped[key]);
                else ev.media = val;

                ev.media = _.filter(ev.media, function (m) {
                  return m.thumb;
                });

                ev.media = _.shuffle(ev.media);

                ev.media = _.take(ev.media, 20);

                _.each(ev.media, function (m) {
                  if (m.thumb) {
                    m.thumb =
                      sails.config.master_url + "/media/thumbnail/" + m.id;
                  }
                });
                regrouped.push(ev);
              }
            });
            //check the permissions on these shoots
            Event.find({}).exec(function (err, allevents) {
              var events = _.filter(allevents, function (e) {
                return _.contains(e.ownedby, req.session.passport.user.id);
              });
              return res.json({
                edits: edits,
                shoots: regrouped,
                owned: events,
              });
            });
          });
        });
      });
    });
  },

  /**
   * @apiDefine Post_Production Post Production
   * TODO -- FORMAT OF EDIT JSON
   *
   */

  /**
   * @api {post} /api/post/myedits List User Edits
   * @apiName listedits
   * @apiGroup Post_Production
   * @apiVersion 0.0.2
   *
   *
   * @apiSuccess {Array} edits List of edits.
   */
  myedits: function (req, res) {
    Edits.findByBuildVariant(req, function (err, edits) {
      return res.json(edits);
    });
  },

  alledits: function (req, res) {
    if (!req.params.id) return res.status(500).json({ msg: "No edit found" });

    Edits.find({ "media.0.event_id": req.params.id }).exec(function (
      err,
      edits
    ) {
      var user_ids = _.pluck(edits, "user_id");
      User.find(user_ids).exec(function (err, users) {
        _.each(edits, function (e) {
          var u = _.find(users, { id: e.user_id });
          if (u) {
            e.user = {
              name: u.profile.displayName,
              photo: u.profile.photos
                ? u.profile.photos[0].value
                : "/images/user.png",
            };
          } else e.user = "Unknown";
        });
        return res.json(edits);
      });
    });
  },

  queuelength: function (req, res) {
    Editor.queuelength(function (val) {
      return res.json(val);
    });
  },

  /**
   * @api {get} /api/post/media List Shoot Media
   * @apiName listmediapost
   * @apiGroup Post_Production
   * @apiVersion 0.0.2
   *
   * @apiSuccess {Object} edit The edit that was created.
   */
  mediaforview: function (req, res) {
    req.params.criteria = {
      path: {
        "!": null,
      },
    };

    Media.getnicejson(req, res, req.param("id"), function (media) {
      Event.findOne(req.param("id")).exec(function (err, event) {
        //filter out clips that are not mine
        if (!event.publicview) {
          allmedia = _.reject(media, function (m) {
            return m.ownedby != req.session.passport.user.id;
          });
        } else {
          allmedia = media;
        }
        return res.json({
          publicview: event.publicview,
          canshare: event.publicshare,
          media: allmedia,
        });
      });
    });
  },

  /**
   * @api {post} /api/post/edit Get Edit
   * @apiName getedit
   * @apiGroup Post_Production
   * @apiVersion 0.0.2
   *
   * @apiParam {id} id of edit
   *
   * @apiSuccess {Object} edit The edit
   */
  edit: function (req, res) {
    Edits.findOne(req.param("id")).exec(function (err, edit) {
      if (!err && edit) {
        return res.json(edit);
      } else {
        return res.status(500).json({ msg: "No edit found" });
      }
    });
  },

  deleteedit: function (req, res) {
    Edits.destroy(req.param("id")).exec(function (err, edit) {
      return res.json({ msg: "ok" });
    });
  },

  /**
   * @api {post} /api/post/saveedit Save Edit
   * @apiName saveedit
   * @apiGroup Post_Production
   * @apiVersion 0.0.2
   *
   *
   * @apiSuccess {Object} edit The edit that was created.
   */
  saveedit: function (req, res) {
    Edits.findOrCreate(
      { id: req.param("id") },
      { user_id: req.session.passport.user.id },
      function (err, edit) {
        var tmpedit = edit;
        tmpedit.media = req.param("media");
        tmpedit.title = req.param("title");
        tmpedit.description = req.param("description");
        tmpedit.transcription = req.param("transcription");
        var newmedia = [];
        _.each(tmpedit.media, function (m) {
          var newm = {
            id: m.id,
            path: m.path,
            inpoint: m.inpoint,
            outpoint: m.outpoint,
            thumb: m.thumb,
            event_id: m.event_id,
            lowres: m.lowres,
            titletext: m.titletext,
            audio: m.audio,
            credits: m.credits,
            tag: m.tag,
          };
          newmedia.push(newm);
        });
        tmpedit.media = newmedia;
        // console.log(req);
        tmpedit.save(function (err) {
          return res.json(tmpedit);
        });
      }
    );
  },

  view: function (req, res) {
    //var lookupid = req.session.event;
    //console.log(lookupid);

    //if event is explicitally set in GET
    //if (req.params.id)
    //{
    var lookupid = req.params.id;
    //}

    //req.session.event = lookupid;

    //event config screen -- module selection for the event
    //console.log(lookupid);
    Event.findOne(lookupid).exec(function (err, event) {
      if (event == undefined) {
        //console.log("no event found view page "+lookupid);
        //req.session.flash = {err:"Event not found"};
        return res.redirect("/dashboard");
      }
      //console.log(event);
      event.calcphases();
      res.view({ event: event, viewonly: true });
    });
  },

  /**
   * @api {get} /api/post/getvideo/:id Direct video link for edit
   * @apiDescription Get preview video for media
   * @apiName editvideo
   * @apiGroup Post_Production
   * @apiVersion 0.0.2
   *
   * @apiParam {String} id Id of edit
   *
   */
  getvideo: function (req, res) {
    var id = req.param("id");
    Edits.findOne(id, function (err, m) {
      //FOR LOCAL
      if (sails.config.LOCALONLY) {
        if (
          req.header("host") == "localhost" ||
          _.includes(req.header("referer"), "localhost")
        )
          return res.redirect(`/upload/transcode/upload/edits/${m.code}.mp4`);
        else
          return res.redirect(
            `${sails.config.FAKES3URL_TRANSCODE}/edits/${m.code}.mp4`
          );
      } else {
        var options = {
          keypairId: sails.config.CLOUDFRONT_KEY,
          privateKeyPath: sails.config.CLOUDFRONT_KEYFILE,
          expireTime: moment().add(1, "day"),
        };

        var signedUrl = cloudfront.getSignedUrl(
          `${sails.config.S3_TRANSCODE_URL}/edits/${m.shortlink}.mp4`,
          options
        );
        //console.log(signedUrl);
        return res.redirect(signedUrl);
      }
    });
  },

  getvideotags: function (req, res) {
    var id = req.param("id");
    Edits.findOne(id, function (err, m) {
      //LOCAL ONLY
      if (sails.config.LOCALONLY) {
        return res.redirect(
          `${sails.config.FAKES3URL}/edits/${m.code}_tags.mp4`
        );
      } else {
        var options = {
          keypairId: sails.config.CLOUDFRONT_KEY,
          privateKeyPath: sails.config.CLOUDFRONT_KEYFILE,
          expireTime: moment().add(1, "day"),
        };

        var signedUrl = cloudfront.getSignedUrl(
          `${sails.config.S3_CLOUD_URL}/edits/${m.shortlink}_tags.mp4`,
          options
        );
        //console.log(signedUrl);
        return res.redirect(signedUrl);
      }
    });
  },

  //returns a list of valid CC music to use as background music to videos:
  music: function (req, res) {
    var output = _.map(music.tracks, (m) => {
      m.url = sails.config.master_url + "/music/" + m.path;
      return m;
    });
    return res.json(output);
  },

  //HIGHRES VERSION OF THE EDIT
  getvideofull: function (req, res) {
    var id = req.param("id");
    Edits.findOne(id, function (err, m) {
      //LOCAL ONLY
      if (sails.config.LOCALONLY) {
        return res.redirect(`${sails.config.FAKES3URL}/edits/${m.code}.mp4`);
      } else {
        var options = {
          keypairId: sails.config.CLOUDFRONT_KEY,
          privateKeyPath: sails.config.CLOUDFRONT_KEYFILE,
          expireTime: moment().add(1, "day"),
        };

        var signedUrl = cloudfront.getSignedUrl(
          `${sails.config.S3_CLOUD_URL}/edits/${m.shortlink}.mp4`,
          options
        );
        //console.log(signedUrl);
        return res.redirect(signedUrl);
      }
    });
  },

  //HIGHRES VERSION OF THE EDIT
  getvideohq: function (req, res) {
    var id = req.param("id");
    Edits.findOne(id, function (err, m) {
      //LOCAL ONLY
      if (sails.config.LOCALONLY) {
        return res.redirect(`${sails.config.FAKES3URL}/edits/${m.code}_hq.mp4`);
      } else {
        var options = {
          keypairId: sails.config.CLOUDFRONT_KEY,
          privateKeyPath: sails.config.CLOUDFRONT_KEYFILE,
          expireTime: moment().add(1, "day"),
        };

        var signedUrl = cloudfront.getSignedUrl(
          `${sails.config.S3_CLOUD_URL}/edits/${m.shortlink}_hq.mp4`,
          options
        );
        //console.log(signedUrl);
        return res.redirect(signedUrl);
      }
    });
  },

  //for an admin of the shoot to clone the edit:
  cloneedit: async function (req, res) {
    // let original = req.param('id');

    let original = await Edits.findOne({ id: req.param("id") });

    Edits.genlink(function (newlink) {
      //console.log(newlink);
      original.title = req.__("Copy of %s", original.title);
      // delete original.code;
      // delete original.shortlink;
      original.progress = 0;
      original.createdAt = new Date();
      original.updatedAt = new Date();
      delete original.fail;
      delete original.hasoriginal;
      delete original.hastagged;
      delete original.hashighquality;
      original.code = newlink;
      original.shortlink = newlink;
      original.path = null;
      // original.progress = null;
      delete original.id;

      //return new edit and shortcode
      Edits.create(original).exec(function (err, edit) {
        return res.redirect("/watch/edits/" + original.media[0].event_id);
      });
    });
  },

  getsettings: async function (req, res) {
    let settings = await Settings.find();

    let mapped = {};
    _.each(settings, function (s) {
      mapped[s.name] = s.value;
      // console.log(s);
    });

    // console.log(settings);
    // console.log(mapped);

    return res.json(mapped);
  },

  setting: async function (req, res) {
    let setting = await Settings.findOrCreate(
      { name: req.param("name") },
      { name: req.param("name") }
    );

    setting.value = req.param("value");
    setting.save(function (err) {
      return res.json({ msg: "ok" });
    });
  },

  //change ownership of edit:
  changeownership: async function (req, res) {
    // let original = req.param('id');

    let original = await Edits.findOne({ id: req.param("id") });
    let userid = req.param("user");

    let user = await User.findOne({ id: userid });

    //if no user found - assume that you are passing the displayname, in which case lookup the latest user with this name:
    if (!user) {
      // console.log(user);

      let withname = await User.find({
        "profile.displayName": userid,
        sort: "updatedAt DESC",
      });
      // console.log(withname);

      userid = _.first(withname).id;
      // console.log(userid);
    }

    if (original) {
      original.user_id = userid;

      original.save(function (err) {
        return res.redirect("/watch/edits/" + original.media[0].event_id);
      });
    } else return res.status("500");
  },

  /**
   * @api {post} /api/post/newedit Create Edit
   * @apiName newedit
   * @apiGroup Post_Production
   * @apiVersion 0.0.2
   *
   * @apiParam {Array} media List of media objects (or id's?)
   *
   * @apiSuccess {Object} edit The edit that was created.
   */
  newedit: function (req, res) {
    //process edit:

    //check that this footage can be used:
    //trigger process to generate video:
    var media = req.param("media");
    var title = req.param("title");
    var description = req.param("description");

    //make media smaller:
    var newmedia = [];
    _.each(media, function (m) {
      var newm = {
        id: m.id,
        inpoint: m.inpoint,
        outpoint: m.outpoint,
        path: m.path,
        thumb: m.thumb,
        event_id: m.event_id,
        lowres: m.lowres,
        titletext: m.titletext,
        audio: m.audio,
        credits: m.credits,
        tag: m.tag,
      };
      newmedia.push(newm);
    });

    //console.log(newmedia);

    if (newmedia && newmedia.length > 0) {
      Edits.genlink(function (newlink) {
        //console.log(newlink);
        //return new edit and shortcode
        Edits.findOrCreate(
          { id: req.param("id") },
          {
            user_id: req.session.passport.user.id,
            media: newmedia,
            title: title,
            description: description,
          }
        ).exec(async function (err, edit) {
          //console.log(err);
          //fire off to editor:
          //send back to user:
          let event = await Event.findOne({ id: media[0].event_id });

          if (event.processedits) {
            edit.code = newlink;
            edit.progress = 0;
            edit.shortlink = newlink;
          }

          edit.title = title;
          edit.media = newmedia;
          edit.description = description;
          edit.defaulttopiclang = event.defaulttopiclang;

          edit.save(async function (err) {
            //console.log(err);
            //console.log("processing edit");
            try {
              if (event.processedits) {
                Editor.edit(edit);
                edit.shortlink = sails.config.master_url + "/v/" + edit.code;
                res.json(edit);
              } else {
                //cant edit:
                console.log("Editing Currently Disabled");
                // res.status(201).json({msg:'Editing Currently Disabled'});
                res.status(503).json(edit);
              }
            } catch (e) {
              res.status(500).json({ msg: e });
            }
          });
        });
      });
    } else {
      res.status(500).json({ msg: "No clips provided" });
    }
  },

  renderhq: async function (req, res) {
    // console.log('render tagged visit')
    // let canedit = await Event.findOne({ name: "processedits" });
    // if (canedit.value == "true") {
    Edits.findOne(req.params.id).exec(function (err, edit) {
      if (edit) {
        Edits.genlink(function (newlink) {
          console.log("rendering hq");
          //console.log(edit);
          //console.log(edit.media);
          //console.log(edit.media.length > 1);

          //TODO CHANGE THIS BACK
          if (edit.media && edit.media.length > 0) {
            edit.code = edit.code || newlink;
            edit.failed = false;
            edit.fail = false;
            edit.path = null;
            edit.progress = null;
            edit.save(function (err) {
              //fire off to editor:
              //send back to user:
              console.log("edit submitted");
              Editor.edit(edit, "high");
              edit.shortlink = sails.config.master_url + "/v/" + edit.code;
              res.redirect("/watch/edits/" + req.params.eventid);
            });
          } else {
            res.redirect("/watch/edits/" + req.params.eventid);
          }
        });
      } else {
        res.redirect("/watch/edits/" + req.params.eventid);
      }
    });
    // } else {
    //   res.redirect("/watch/edits/" + req.params.eventid);
    // }
  },

  //can only run this if the original already exists...
  rendertagged: async function (req, res) {
    // console.log('render tagged visit')
    // let canedit = await Settings.findOne({ name: "processedits" });
    // if (canedit.value == "true") {
    Edits.findOne(req.params.id).exec(function (err, edit) {
      if (edit && edit.hasoriginal) {
        console.log("rendering tagged");
        //console.log(edit);
        //console.log(edit.media);
        //console.log(edit.media.length > 1);

        //TODO CHANGE THIS BACK
        if (edit.media && edit.media.length > 0) {
          edit.failed = false;
          edit.fail = false;
          edit.path = null;
          edit.progress = null;
          edit.save(function (err) {
            //fire off to editor:
            //send back to user:
            console.log("edit submitted");
            Editor.edit(edit, "tagged");
            edit.shortlink = sails.config.master_url + "/v/" + edit.code;
            res.redirect("/watch/edits/" + req.params.eventid);
          });
        } else {
          res.redirect("/watch/edits/" + req.params.eventid);
        }
      } else {
        console.log("no edit or original file present");
        res.redirect("/watch/edits/" + req.params.eventid);
      }
    });
    // } else {
    //   res.redirect("/watch/edits/" + req.params.eventid);
    // }
  },

  renderoriginal: async function (req, res) {
    // console.log('render tagged visit')
    // let canedit = await Settings.findOne({ name: "processedits" });
    // if (canedit.value == "true") {
    Edits.findOne(req.params.id).exec(function (err, edit) {
      if (edit) {
        Edits.genlink(function (newlink) {
          console.log("rendering original (again)");
          //console.log(edit);
          //console.log(edit.media);
          //console.log(edit.media.length > 1);

          //TODO CHANGE THIS BACK
          if (edit.media && edit.media.length > 0) {
            edit.failed = false;
            edit.fail = false;
            edit.path = null;
            edit.progress = null;
            edit.code = edit.code || newlink;
            edit.save(function (err) {
              //fire off to editor:
              //send back to user:
              console.log("edit submitted");
              Editor.edit(edit);
              edit.shortlink = sails.config.master_url + "/v/" + edit.code;
              res.redirect("/watch/edits/" + req.params.eventid);
            });
          } else {
            res.redirect("/watch/edits/" + req.params.eventid);
          }
        });
      } else {
        console.log("no edit present");
        res.redirect("/watch/edits/" + req.params.eventid);
      }
    });
    // } else {
    //   res.redirect("/watch/edits/" + req.params.eventid);
    // }
  },

  /**
   * @api {get} /api/post/editprogress Get Edit Progress
   * @apiName editprogress
   * @apiGroup Post_Production
   * @apiVersion 0.0.2
   *
   * @apiParam {string} Edit id
   *
   * @apiSuccess {Object} progress
   */
  editprogress: function (req, res) {
    Edits.findOne(req.params.id).exec(function (err, edit) {
      if (edit) {
        //console.log({failed:edit.failed, progress:edit.progress, path:edit.path});
        res.json({
          failed: edit.failed,
          progress: edit.progress,
          path: edit.path,
        });
      } else {
        res.status(500).json({ msg: "Invalid Edit Provided" });
      }
    });
  },

  /**
   *	Register for edit Updates
   */
  editupdates: function (req, res) {
    //for each one, set a time and check-- and then update...
    var ids = req.param("edits");
    // console.log("edit updates");
    // console.log(ids);
    Edits.subscribe(req, ids);
    //set a time for them:
    _.each(ids, function (e) {
      checkStatus(e);
    });
    return res.json({ msg: "subscribed" });
  },

  /**
   *	Register for edit Updates
   */
  canceleditupdates: function (req, res) {
    //for each one, set a time and check-- and then update...
    var ids = req.param("edits");
    Edits.unsubscribe(req, ids);
    return res.json({ msg: "unsubscribed" });
  },

  shortlink: function (req, res) {
    //console.log(req.param('shortlink'));
    if (!req.param("shortlink")) {
      req.session.flash = {
        msg: req.__("Sorry, that's not a link we recognise."),
      };
      console.log("r1");
      return res.redirect("/dashboard");
    }

    Edits.findOne({ shortlink: req.param("shortlink") }).exec(function (
      err,
      edit
    ) {
      if (edit) {
        Event.findOne(edit.media[0].event_id).exec(function (err, ev) {
          if (!ev) {
            req.session.flash = {
              msg: req.__("Sorry, that's not a link we recognise."),
            };
            console.log("r2");
            return res.redirect("/dashboard");
          }
          User.findOne(edit.user_id).exec(function (err, user) {
            // console.log(req.session)
            if (
              ev.publicshare ||
              (req.session &&
                req.session.passport &&
                req.session.passport.user &&
                _.contains(ev.ownedby, req.session.passport.user.id)) ||
              (req.session &&
                req.session.passport &&
                req.session.passport.user &&
                _.contains(
                  sails.config.admin_email,
                  req.session.passport.user.profile.emails[0].value
                ))
            ) {
              edit.user = user;
              res.view({ edit: edit, _layoutFile: null });
            } else {
              //cant share:
              res.view({ cantshare: true, _layoutFile: null });
            }
          });
        });
        //return res.redirect(301, sails.config.S3_TRANSCODE_URL + edit.path);
      } else {
        req.session.flash = {
          msg: req.__("Sorry, that's not a link we recognise."),
        };
        console.log("r3");
        return res.redirect("/dashboard");
      }
    });
  },
};
