/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
const path = require('path');
const sharp = require('sharp');
const moment = require('moment');
// const fs = require('fs-extra');
const knox = require('knox-s3');
let client;
//upload map file for an event role:
if (!sails.config.LOCALONLY)
{
	const knox_params = {
		key: sails.config.AWS_ACCESS_KEY_ID,
		secret: sails.config.AWS_SECRET_ACCESS_KEY,
		bucket: sails.config.S3_BUCKET
	}
	client = knox.createClient(knox_params);
}

module.exports = {

	index: function (req, res) {
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
				console.log("no event found view page " + lookupid);
				//req.session.flash = {err:"Event not found"};
				return res.redirect('/dashboard');
			}
			//console.log(event);
			event.calcphases();
			res.view({ event: event, pagetitle: 'Adjust' });
		});
	},

	addshot: function (req, res) {
		if (req.file('image') != undefined) {
			// console.log('GETTING FILE');

			req.file('image').upload(function (err, tt) {
				// console.log('GETTING FILE');

				//console.log(err);
				if (tt.length == 0) {
					req.session.flash = sails.__('No image provided');
					return res.redirect('/commission/' + req.param('id'));
				}

				// console.log(err);


				var uuid = require('uuid');
				var fakeid = uuid.v1();
				var filename = fakeid + tt[0].filename;
				var tmp = '.tmp/uploads/' + tt[0].fd;

				var dest_file = path.resolve('./data/images/' + path.basename(tmp));
				var dest_file_thumb = path.resolve('./data/icons/' + path.basename(tmp) + '_small.png');
				// console.log(dest_file);
				// console.log(dest_file_thumb);

				// console.log(tt[0]);
				

				// console.log(tmp);
				

				sharp(tmp)
					.resize(853, 480)
					.png()
					.toFile(dest_file, function (err) {
						// console.log('MADE FILE 1');

						//filename to write to:
						// image.writeFile(dest_file, function(err){
							// console.log(err);
							
						if (err)
						{
							req.session.flash = err.toString();
							return res.redirect('/commission/' + req.param('id'));
						}

						sharp(tmp)
							.resize(200, 113)
							.png()
							.toFile(dest_file_thumb, function (err) {

// console.log('MADE FILE 2');

								// console.log(err);
								if (err)
									return res.redirect('/commission/' + req.param('id'));

								//copy to the .tmp dir for serving:
								// fs.copySync(dest_file_thumb,path.resolve('./.tmp/public/data/icons/'+ path.basename(tmp) + '_small.png'));
								// fs.copySync(dest_file,path.resolve('./.tmp/public/data/images/'+ path.basename(tmp)));

								var newshot = {};
								newshot.name = 'Custom Shot ' + new Date();
								// newshot.description = req.param('description')
								newshot.image = path.basename(dest_file);
								newshot.icon = path.basename(dest_file_thumb);
								newshot.wanted = 7;
								newshot.max_length = 20;
								Shot.create(newshot).exec(function (err, done) {
									req.session.flash = sails.__("New Shot Added");
									return res.redirect('/commission/' + req.param('id'));
								});
							}); //write file
						// });//cover
					});//tofile
				// }); //write file
				// });//cover
				// });//lwip open
			});//upload
		}
		else {
			// console.log('NO IMAGE');

			return res.redirect('/commission/' + req.param('id'));
		}
	},

	example: function (req, res) {
		EventTemplate.findOne(req.params.id).exec(function (err, data) {
			if (data) {
				var shuff = _.shuffle(data.shot_types);
				res.json(_.take(shuff, 14));
			}
			else {
				res.json([]);
			}
		});
	},

	// savetoreuse: function (req, res) {
	// 	var input = req.param('eventtype');
	// 	input.user_id = req.session.passport.user.id;
	// 	delete input.id;
	// 	delete input.createdAt;
	// 	delete input.updatedAt;
	// 	EventTemplate.create(input).exec(function () {
	// 		res.json({ msg: 'ok' });
	// 	});
	// },

	// savetocommunity: function (req, res) {
	// 	var input = req.param('eventtype');
	// 	delete input.id;
	// 	input.user_id = req.session.passport.user.id;
	// 	input.community = true;
	// 	delete input.createdAt;
	// 	delete input.updatedAt;
	// 	//input.user_id = req.session.passport.user.id;
	// 	EventTemplate.create(input).exec(function () {
	// 		res.json({ msg: 'ok' });
	// 	});
	// },

	// savetooriginal: function (req, res) {
	// 	var input = req.param('eventtype');
	// 	delete input.id;
	// 	delete input.createdAt;
	// 	delete input.updatedAt;
	// 	input.original = true;
	// 	//input.user_id = req.session.passport.user.id;
	// 	EventTemplate.create(input).exec(function () {
	// 		res.json({ msg: 'ok' });
	// 	});
	// },

	/**
	 * @api {post} /api/commission/update/:id Update Template
	 * @apiName updatetemplate
	 * @apiGroup Commission
	 * @apiVersion 0.0.2
	 *
	 * @apiParam {String} id Shoot ID
	 * @apiParam {Object} eventtype Shoot template
	 *
	 * @apiSuccess {String} msg Should return 'ok'
	 */
	update: function (req, res) {
		//console.log(req.param(.)eventtype);
		Event.findOne(req.params.id).exec(function (err, e) {
			if (e == null || !req.param('eventtype'))
				return res.status(500).json({ msg: 'no shoot or eventtype specified' });

			//also merge the changes with the main template in use (the properties at the top level)
			var new_eventtype = req.param('eventtype');
			var new_shoot_modules = new_eventtype.shoot_modules;
			var new_post_modules = new_eventtype.post_modules;
			var new_phases = new_eventtype.phases;
			var new_coverage = new_eventtype.coverage_classes;


			//fix for coverage class array -- which NEEDS to be an associative array:
			var i = 0;
			var tmp = {};
			_.each(new_coverage, function (e, f) {
				tmp[i.toString()] = e;
				i++;
			});
			new_coverage = tmp;

			new_eventtype.coverage_classes = new_coverage;
			e.eventtype.roles = new_eventtype.roles;

			

			Utility.generateRoleMap(e, function (ex) {

				new_eventtype.roleimg = ex.eventtype.roleimg;
				Event
				.update({ id: req.params.id }, { eventtype: new_eventtype, shoot_modules: new_shoot_modules, post_modules: new_post_modules, phases: new_phases, coverage_classes: new_coverage  })
				.exec(function (err, done) {

					if (!sails.config.LOCALONLY) {

						client.putFile(path.join(__dirname, '..', '..', 'upload', ex.eventtype.roleimg), 'upload/' + ex.eventtype.roleimg,
							function (err, result) {

								if (!err) {
									sails.eventmanager.addevent(req.params.id);
									sails.eventmanager.updateevent(req.params.id);
									res.json({ msg: 'ok' });
								}
								else {
									// sails.eventmanager.addevent(req.params.id);
									// sails.eventmanager.updateevent(req.params.id);
									res.status(500).json({ msg: 'ok' });
								}
							});
					}
					else
					{
						sails.eventmanager.addevent(req.params.id);
						sails.eventmanager.updateevent(req.params.id);
						res.json({ msg: 'ok' });
					}
				});
			});
		});
	},

	info: function (req, res) {
		var lookupid = req.session.event;
		//console.log(lookupid);

		//if event is explicitally set in GET
		if (req.params.id) {
			lookupid = req.params.id;
		}

		req.session.event = lookupid;

		//event config screen -- module selection for the event
		//console.log(lookupid);
		Event.findOne(lookupid).exec(function (err, event) {
			Media.find({ event_id: lookupid }).exec(function (err, media) {
				var grouped = _.groupBy(media, function (m) {
					return m.meta.static_meta.shot;
				});

				_.each(event.eventtype.shot_types, function (t) {
					t.footage = grouped[t.id];
				});
				res.json(event);
			});
		});
	},

	clone: async function(req,res)
	{
		let event = await Event.findOne(req.param('id'));

		event.id = null;
		event.name = "Copy of " + event.name;

		Event.create(event,function(err){	
			return res.redirect('/dashboard');
		})
	},

	/**
	 * @api {get} /api/commission/gettemplate/:id Get Template Info
	 * @apiDescription Returns the commissioning template for the given shoot.
	 * @apiName gettemplate
	 * @apiGroup Commission
	 * @apiVersion 0.0.2
	 *
	 * @apiParam {String} id Shoot ID
	 *
	 * @apiSuccess {String} msg Should return template
	 */
	templateinfo: function (req, res) {
		//var lookupid = req.session.event || req.session.passport.user.currentevent;
		//console.log(lookupid);

		//if event is explicitally set in GET
		if (req.params.id) {
			lookupid = req.params.id;
		}
		else {
			return res.json({ msg: 'no shoot specified' }, 500);
		}

		//req.session.event = lookupid;
		//console.log(lookupid);
		Event.findOne(lookupid).exec(function (err, event) {
			//console.log(err);
			if (err || !event) {
				res.json({ msg: 'Shoot not found' }, 500);
			}
			else {
				Media.find({ event_id: lookupid }).exec(function (err, media) {
					var grouped = _.groupBy(media, function (m) {
						return m.meta.static_meta.shot;
					});

					_.each(event.eventtype.shot_types, function (t) {
						t.footage = _.size(grouped[t.id]);
					});
					res.json(event);
				});
			}
		});
	},

	new: function (req, res) {

		if (!req.session.passport.user.currentevent) {
			res.locals.firstlogin = true;
			delete req.session.firstlogin;
		}
		else {
			res.locals.firstlogin = false;
		}

		// var tys = EventTemplate.find({or:[{user_id:req.session.passport.user.id}, {user_id:null}, {community:true}]}).sort({'user_id':-1,'name':1}).exec(function(err,data){
		res.view();
		// });
	},


	/**
	 * @api {get} /api/commission/seedtemplates Get List of Seed Templates
	 * @apiName seedtemplates
	 * @apiGroup Commission
	 * @apiVersion 0.0.2
	 *
	 *
	 * @apiSuccess {String} msg Returns list of templates (own, public and community) to use as starting points for template design.
	 */
	seedtemplates: function (req, res) {
		var filter = req.session.buildvariant.templates;
		if (!filter) {
			EventTemplate.find({ or: [{ user_id: req.session.passport.user.id }, { user_id: null }, { community: true }] }).sort({ 'user_id': -1, 'name': 1 }).exec(function (err, data) {

				// var results = _.map(data,function(e){
				// 	return {id:e.id,name:e.name,description:e.description};
				// });

				res.json(data);
			});
		}
		else {
			EventTemplate.find({ or: [{ user_id: req.session.passport.user.id }, { user_id: null }, { community: true }], id: filter }).sort({ 'user_id': -1, 'name': 1 }).exec(function (err, data) {

				// var results = _.map(data,function(e){
				// 	return {id:e.id,name:e.name,description:e.description};
				// });

				res.json(data);
			});
		}
	},

	/**
	 * @api {get} /api/commission/getseedtemplate/:id Get Specific Seed Template
	 * @apiName getseedtemplate
	 * @apiGroup Commission
	 * @apiVersion 0.0.2
	 *
	 *
	 * @apiSuccess {String} msg Returns list of templates (own, public and community) to use as starting points for template design.
	 */
	getseedtemplate: function (req, res) {
		var tys = EventTemplate.findOne(req.params.id).exec(function (err, data) {
			if (data)
				res.json(data);
			else
				res.status(404).json({ msg: 'Template not found', status: 404 });
		});
	},

	/**
	 * @api {get} /api/commission/shots Get Shot Library
	 * @apiName getshots
	 * @apiGroup Commission
	 * @apiVersion 0.0.2
	 *
	 *
	 * @apiSuccess {String} msg Should return library of shots
	 */
	allshots: function (req, res) {
		Shot.find({}).exec(function (err, shots) {

			//remove duplicates:
			var uni = _.unique(shots, function (u) {
				return u.name + u.icon;
			})
			res.json(uni);
		});
	},

	// createinstantshoot: function (req, res) {
	// 	//template.id
	// 	// newshoot.name = name;
	// 	// newshoot.ispublic = publicshoot;

	// 	//do save
	// 	EventTemplate.findOne(req.body.eventtype.id).exec(function (err, myev) {
	// 		if (err || !myev)
	// 			return res.json({ msg: 'no template found' }, 500);

	// 		var coverage_classes = myev.coverage_classes;
	// 		//console.log(coverage_classes);
	// 		_.each(coverage_classes, function (c) {
	// 			c.items = [];
	// 		});

	// 		//fix for non array based coverage class
	// 		var i = 0;
	// 		var tmp = {};
	// 		_.each(coverage_classes, function (e, f) {
	// 			tmp[i.toString()] = e;
	// 			i++;
	// 		});
	// 		coverage_classes = tmp;

	// 		//add in missing modules:
	// 		if (!myev.post_modules) {
	// 			myev.post_modules = {};
	// 			_.each(_.pluck(sails.eventmanager.post_modules, 'codename'), function (m) {
	// 				myev.post_modules[m] = 0;
	// 			});
	// 		}

	// 		if (!myev.shoot_modules) {
	// 			myev.shoot_modules = {};
	// 			_.each(_.pluck(sails.eventmanager.event_modules, 'codename'), function (m) {
	// 				myev.shoot_modules[m] = 0;
	// 			});

	// 			//var lastone = _.last(_.pluck(sails.eventmanager.event_modules,'codename'));
	// 			myev.shoot_modules['marathondirector'] = "1";
	// 		}

	// 		if (!myev.ruleset) {
	// 			myev.ruleset = [{ direction_engine: 'manual', name: 'manual', pre_time: 0 }];
	// 		}

	// 		var meta_modules = myev.meta_modules;
	// 		var post_modules = myev.post_modules;
	// 		var shoot_modules = myev.shoot_modules;
	// 		var phases = myev.phases;

	// 		// 'offlinecode' is actually used as the shortlink for sharing...
	// 		Event.getnewcode(function (code) {
	// 			//joincode used for single drop code for any contributor to register.
	// 			Event.getnewcode(function (joincode) {

	// 				var whichserver = sails.config.hostname + ':' + sails.config.port;

	// 				var neevent = _.extend(req.params.all(), {
	// 					publicshare: 0,
	// 					public: req.body.ispublic,
	// 					publicview: 1,
	// 					publicedit: 1,
	// 					eventtype: myev,
	// 					ownedby: [req.session.passport.user.id],
	// 					meta_modules: meta_modules,
	// 					post_modules: post_modules,
	// 					shoot_modules: shoot_modules,
	// 					coverage_classes: coverage_classes,
	// 					offlinecode: code,
	// 					codes: [],
	// 					phases: phases
	// 				});
	// 				delete neevent.id;
	// 				neevent.created_by = req.session.passport.user.id;
	// 				var regex = /(<([^>]+)>)/ig;
	// 				var newval = neevent.name.replace(regex, "");
	// 				neevent.name = newval;
	// 				neevent.public = req.body.ispublic;
	// 				neevent.joincode = joincode;
	// 				neevent.name = req.body.name;

	// 				//starts and ends dates

	// 				neevent.starts = moment().format('DD-MM-YYYY');
	// 				neevent.starts_time = '1am';
	// 				neevent.ends = moment().add(7, 'days').format('DD-MM-YYYY');
	// 				neevent.ends_time = '1am';

	// 				Event.create(neevent, function (err, event) {

	// 					console.log(err);
	// 					if (err) {
	// 						return res.status(500).json({ msg: err });
	// 					}
	// 					else {
	// 						//console.log("requesting server address");
	// 						var reqs = require('request');

	// 						process.nextTick(function () {
	// 							//console.log("tick");
	// 							reqs(sails.config.multiserver + '/newevent/?id=' + event.id, function (err, ress, body) {
	// 								if (!err) {
	// 									//console.log("got " + body);
	// 									whichserver = JSON.parse(body).server;
	// 								}

	// 								if (sails.localmode || sails.hostname == whichserver || err) {
	// 									//get which host is supposed to run this event:
	// 									console.log("adding event to director")
	// 									sails.eventmanager.addevent(event.id);
	// 								}

	// 								console.log("whichserver: " + whichserver);

	// 								event.server = whichserver;
	// 								event.save(function (err) {
	// 									if (err) {
	// 										return res.status(500).json({ msg: err });
	// 									}

	// 									return res.json({
	// 										id: event.id,
	// 										joincode: event.joincode
	// 									});
	// 								});
	// 							});//end request for server
	// 						});//tick
	// 					}//end if err
	// 				});//end event create
	// 			});//end code generate
	// 		});
	// 	});//end get details...
	// },


	/**
	 * @api {post} /api/commission/updateshots/:id Update Shot Requests
	 * @apiDescription Update shoot shot requirements and notify all currently connected contributors of the changes.
	 * @apiName updatetemplate_live
	 * @apiGroup Commission
	 * @apiVersion 0.0.2
	 *
	 * @apiParam {String} id Shoot ID
	 * @apiParam {Object} shots New Shot List
	 *
	 * @apiSuccess {String} msg 'Shoot Updated'
	 */
	updateshots: function (req, res) {
		//update shots and notify people who are connected:
		if (req.param('id')) {
			Event.findOne(req.param('id')).exec(function (err, ev) {
				if (ev != null) {
					var newshots = req.param('shots');
					//console.log(newshots);

					_.each(newshots, function (d) {
						delete d.isnew;
						delete d.footage;
					});

					ev.eventtype.shot_types = newshots;
					ev.save(function (err, done) {
						sails.eventmanager.updateevent(ev.id);
						res.json({ msg: 'Shoot Updated' });
					});
				}
				else {
					return res.json({ msg: 'no shoot specified' }, 500);
				}
			});
		}
		else {
			res.json({ msg: 'no event specified' }, 500);
		}
	}
};
