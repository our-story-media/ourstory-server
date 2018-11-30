/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
/**
* AuthController
*
* @module		:: Controller
* @description	:: Contains logic for handling requests.
*/

const fs = require('fs-extra');
const passport = require('passport');
// const uploaddir = "/upload/";
// const path = require('path');
const usercount = 0;
const VERSION_STRING = 12;
// const moment = require('moment');
const urlencode = require('urlencode');

const landingPage = fs.readFileSync(__dirname + '/../../assets/landing/public/index.html').toString();

module.exports = {
	getstarted: function(req,res){
		//if logged in, redirect to dashboard:
		if (req.session.profile && req.session.profile.user)
			return res.redirect('/dashboard');
		else
			return res.view();
	},

	locale: function (req, res) {
		//change locale
		req.session.overridelocale = req.param('id');
		//console.log("new locale "+req.param('id'));
		//req.setLocale(req.session.locale);
		//redirect back to same page
		if (req.get('referrer'))
			return res.redirect(req.get('referrer'));
		else
			return res.redirect('/');
	},

	getapp: function (req, res) {
		var MobileDetect = require('mobile-detect'),
			md = new MobileDetect(req.headers['user-agent']);
		//console.log(md);
		if (md.is('iOS')) {
			return res.redirect(sails.config.IOS_STORE_LINK);
		}
		if (md.is('AndroidOS')) {
			return res.redirect(sails.config.PLAY_STORE_LINK);
		}

		req.session.flash = { msg: 'Sorry, we don\'t support your mobile device right now...' };
		return res.redirect('/');
	},

	changename: function (req, res) {
		User.findOne(req.session.passport.user.id).exec(function (err, user) {
			var nn = req.param('name').split(' ');
			if (nn.length < 1) {
				req.session.flash = { msg: 'Please enter your full, real name' };
				return res.redirect('/');
			}

			var regex = /(<([^>]+)>)/ig;
			var newval = req.param('name').replace(regex, "");

			user.profile.displayName = newval;
			req.session.passport.user.profile.displayName = user.profile.displayName;

			user.save(function (err, u) {
				//console.log(u);
				req.session.flash = { msg: 'Your name has been updated!' };
				return res.redirect('/');
			});
		});
	},

	totalstatus: async function (req, res) {
		//contributors...

		let stories = await Edits.count();

		let data = await Media.find({}, { fields: { 'created_by': 1, 'event_id': 1, 'meta.static_meta.clip_length': 1 } ,sort:'created_by'}).sort('created_by');
// console.log(data);
		var medialength = data.length;
		var ucount = _.unique(_.pluck(data, 'created_by')).length;
		var evcount = _.unique(_.pluck(data, 'event_id')).length;

		var mins = _.reduce(data, function (a, f) {
			if (f.meta.static_meta.clip_length) {
				var lena = f.meta.static_meta.clip_length.split(':');
				if (lena.length == 3) {
					return a + (parseInt(lena[0]) * 3600) + (parseInt(lena[1]) * 60) + (parseFloat(lena[2]));
				}
				else {
					return a;
				}
			}
			else {
				return a;
			}
		}, 0);
		//var evcount = _.unique(_.pluck(data,'event_id')).length;

		return res.json({ users: ucount, events: evcount, media: medialength, mins: mins,stories });
		//live right now...

		//total media...

		//hours of footage...
	},

    /**
	 * @api {get} /api/auth/usersearch List Users
	 * @apiName usersearch
	 * @apiGroup Misc
	 * @apiVersion 0.0.2
	 * @apiDescription Search for system users.
     * @apiParam query Search string
	 *
	 * @apiSuccess {Object[]} data List of users
	 */
	usersearch: function (req, res) {
		User.find({
			'profile.displayName': {
				'contains': req.param('query')
			}
		}).sort('profile.displayName DESC').limit(5).exec(function (err, users) {
			return res.json(_.map(users, function (m) {
				return {
					id: m.id,
					email: m.profile.emails[0].value,
					name: m.profile.displayName
				};
			}));
		});
	},

	setprivacy: function (req, res) {
		User.findOne(req.session.passport.user.id).exec(function (err, user) {
			if (!user.permissions)
				user.permissions = {};

			user.permissions[req.param('eventid')] = req.param('privacy');
			user.save(function (err, done) {
				res.json({ msg: 'user updated' });
			});
		});
	},

	/**
	 * @api {get} /api/status Get API Server Status
	 * @apiName status
	 * @apiGroup Misc
	 * @apiVersion 0.0.2
	 * @apiDescription Find out if the Bootlegger API is live, and what version of the client it is expecting.
	 *
	 * @apiSuccess {String} msg 'ok' when server is live
	 * @apiSuccess {Number} version Current server version
	 */
	status: function (req, res) {
		return res.json({ msg: "ok", version: VERSION_STRING });
	},

	login: function (req, res) {
		if (req.wantsJSON && !req.param('viewonly')) {
			if (req.session.passport.user) {
				return res.json({ msg: 'Logged in as ' + req.session.passport.user.id });
			}
			else {
				//console.log('cannot do that (is mobile)');
				return res.status(403).json({ error: 'Please login' });
			}
		}
		else {
			//console.log("resetting login");
			if (sails.config.LOCALONLY)
			{
				return res.redirect('/dashboard');
			}

			req.session.ismobile = false;
			req.session.isios = false;
			if (req.session.passport.user) {
				if (!req.wantsJSON)
					return res.redirect('/dashboard');
				else
					return res.json({ msg: 'Logged In' }, 200);
			}
			else {
				if (!req.wantsJSON) {
					// Event.find({ public: [1, true] }).exec(function (err, upcoming) {
					// 	//console.log(_.pluck(upcoming,'name'));
					// 	var ups = _.filter(upcoming, function (u) {
					// 		//console.log(u.ends);
					// 		//console.log(moment(u.ends,"DD-MM-YYYY"));
					// 		//return true;
					// 		return moment(u.ends, "DD-MM-YYYY").isAfter();
					// 	});
					// 	_.sortBy(ups, function (u) {
					// 		return moment(u.ends, "DD-MM-YYYY").toDate();
					// 	});

					// 	ups.reverse();

						//console.log(req.device);
						//console.log(req.device.is_mobile);

						//if (req.device.type == 'phone')
						//	return res.view({upcoming:_.take(ups,3),_layoutFile: '../login_mobile.ejs'});
						//	else
						return res.send(landingPage);
						// return res.view({ upcoming: _.take(ups, 3), _layoutFile: '../login.ejs' });
					// });
				}
				else {
					//console.log('cannot do that (not mobile)');
					return res.json({ error: 'Please login' }, 403);
				}
			}

			// res.view({
			//   _layoutFile: '../login.ejs'
			// });
		}
	},

	mobilelogin: function (req, res) {
		//reset the api key for custom apps (in case they )
		req.session.api = false;
		switch (req.params.id) {
			case 'google':
				req.session.ismobile = true;
				req.session.isios = true;
				return res.redirect('/auth/google');
			case 'facebook':
				req.session.isios = true;
				req.session.ismobile = true;
				return res.redirect('/auth/facebook');
			case 'local':
				req.session.isios = true;
				req.session.ismobile = true;
				return res.redirect('/auth/local');
			default:
				return res.redirect('/');
		}
	},

	/**
	 * @api {get} /api/auth/login Display Login Screen
	 * @apiDescription Open this link in a browser which redirects to OAuth authentication. When complete, you will either be redirected back to an endpoint the have provided, with the session as a GET paramter, or to bootlegger://success?<sessionid>.
	 * @apiName login
	 * @apiGroup Authentication
	 * @apiVersion 0.0.2
	 *
	 */
	apilogin: function (req, res) {
		req.session.isios = true;
		req.session.ismobile = true;
		req.session.api = true;
		return res.view('auth/api_login_view');
	},

	sessionkey: function (req, res) {
		var cookiesigned = require('cookie-signature');
		var signed = cookiesigned.sign(req.signedCookies['sails.sid'], req.secret);
		signed = "s:" + signed;
		if (!req.session.api) {
			return res.redirect(req.session.buildvariant.redirect_prot + '://success/?' + urlencode(signed));
		}
		else {
			//find user api choice:
			User.findOne({ 'apikey.apikey': req.session.apikey }).exec(function (error, u) {
				if (u) {
					switch (u.apikey.apitype) {
						case 'redirect':
							return res.redirect(u.apikey.redirecturl + '?session=' + urlencode(signed));
						case 'native':
							return res.redirect(req.session.buildvariant.redirect_prot + '://success/?' + urlencode(signed));
						case 'jsonp':
							return res.view('auth/jsonp', { callback: u.apikey.callbackfunction, session: signed, _layoutFile: null });
					}
				}
				else {
					console.log('API Key User not found for ' + req.session.apikey);
					return res.status(500);
				}
			});
		}
	},

	google_return: function (req, res, next) {
		req.session.firstlogin = true;
		if (req.session.ismobile) {
			passport.authenticate('google', { successRedirect: '/auth/sessionkey', failureRedirect: '/auth/login' })(req, res, next);
		}
		else {
			passport.authenticate('google', { successRedirect: '/dashboard', failureRedirect: '/auth/login' })(req, res, next);
		}
	},

	facebook_return: function (req, res, next) {
		req.session.firstlogin = true;
		if (req.session.ismobile) {
			passport.authenticate('facebook', { successRedirect: '/auth/sessionkey', failureRedirect: '/auth/login', failureFlash: true })(req, res, next);
		}
		else {
			passport.authenticate('facebook', { successRedirect: '/dashboard', failureRedirect: '/auth/login', failureFlash: true })(req, res, next);
		}
	},

	dropbox_return: function (req, res, next) {
		passport.authenticate('dropbox-oauth2', { successRedirect: '/post/' + req.session.dbeventid, failureRedirect: '/post/' + req.session.dbeventid })(req, res, next);
	},

	facebook: function (req, res, next) {
		var uuid = require('uuid');
		passport.authenticate('facebook', { scope: ['email'], authType: 'reauthenticate', authNonce: uuid.v4() })(req, res, next);
	},

	google: function (req, res, next) {
		passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'], prompt: 'select_account' })(req, res, next);
	},

	local: function (req, res, next) {
		return res.view('auth/locallogin.ejs', { _layoutFile: '../blank' });
	},

	process_local: function (req, res, next) {

		if(_.size(req.param('firstName')) < 3)
		{
			req.session.flash = { msg: 'Please type a longer name' };		
			return res.redirect('/auth/local');
		}

		req.session.api = false;
		req.session.ismobile = true;
		req.session.isios = true;
		User.create({
			profile: {
				displayName: req.param('firstName'),
				provider: 'local',
				photos: [
					{
						value: sails.config.master_url + '/images/user.png'
					}
				],
				emails: [
					{
						value: null
					}
				],
				
			},
			consent: new Date()
		}, function (err, user) {
			// console.log(user);
			req.logIn(user, function () {
				res.redirect('/auth/sessionkey');
			});
		});
	},

	dropbox: function (req, res, next) {
		//console.log('Trying Login');
		req.session.dbeventid = req.params.id;
		req.session.save();
		passport.authenticate('dropbox-oauth2')(req, res, next);
	},

	joincomplete: function (req, res) {
		return res.view();
	},

	join: function (req, res) {
		var thecode = req.params.id;
		if (!thecode) {
			return res.redirect('/');
		}
		//console.log(thecode);
		Event.findOne({ 'codes.code': thecode }).exec(function (err, event) {

			if (event) {
				var me = _.find(event.codes, function (f) {
					return f.code == thecode;
				});
				me.eventid = event.id;
				req.session.joincode = me;
			}
			return res.view({ shoot: event, me: me });
		});
	},

	joincode: function (req, res) {
		
		if (!req.body.code)
			return res.status(500).json({
				msg: 'Invalid code'
			});

		var thecode = req.body.code;
		// console.log(thecode);
		Event.findOne({
			joincode: thecode
		}).exec(function (err, event) {
			// console.log(err);
			if (event) {

				//push this person onto invite list for the shoot:
				if (event.codes == undefined)
					event.codes = new Array();

				//valid code but not logged in:
				if (!(req.session && req.session.passport && req.session.passport.user))
				{
					return res.status(200).json({
						msg: 'Valid code but need to login'
					});
				}

				if (!_.find(event.codes, function (el) {
					return el.uid == req.session.passport.user.id
				})) {
					event.codes.push({
						uid: req.session.passport.user.id,
						status: 'linked',
						code: thecode
					});
					event.save(function (err) {
						if (err)
							return res.status(500).json({ msg: err });
						return res.json({ eventid: event.id });
					});
				}
				else {
					return res.json({ eventid: event.id });
				}
			}
			else {
				return res.status(500).json({
					msg: 'Invalid code'
				});
			}
		});
	},

	/**
	 * @api {get} /api/auth/logout Logout of API
	 * @apiName logout
	 * @apiGroup Authentication
	 * @apiVersion 0.0.2
	 * @apiDescription Logout current user out of the Bootlegger API. Resets all session data. 
	 *
	 *
	 * @apiSuccess {String} msg Should return 'ok'
	 */
	apilogout: function (req, res) {
		req.logout();
		req.session.destroy();
		res.json({ msg: 'ok' });
	},


	logout: function (req, res) {
		req.logout();
		req.session.destroy();
		res.redirect('/');
	},


	/**
	 * @api {get} /api/auth/anon Local Instance Anonymous Login
	 * @apiName anon
	 * @apiGroup Authentication
	 * @apiVersion 0.0.2
	 *
	 * @apiDescription This endpoint will only work when the server is *NOT* running in production mode - and is intended for local installations / testing. 
	 *
	 * @apiParamm {String} name (optional) Identifier for Anon User. If not provided, system defaults to User #.
	 * @apiSuccess {String} msg Should return 'ok'
	 */
	fakejson: function (req, res) {
		if (!_.contains(process.argv, '--prod')) {
			var uuid = require('node-uuid');
			var fakeid = uuid.v1();
			usercount++;
			req.session.ismobile = true;
			req.session.authenticated = true;
			//req.session.User = {name:'Tom'};
			var user = "Anon User";
			if (req.param('name'))
				user = req.param('name');
			User.findOrCreate({ uid: fakeid }, { uid: fakeid, name: user + ' ' + usercount, profile: { emails: [{ value: 'test@test.com' }], displayName: user + ' ' + usercount, name: { givenName: user + ' ' + usercount } } }, function (err, user) {
				req.session.passport.user = user;
				return res.json({ msg: 'ok' }, 200);
			});
		}
		else {
			return res.json({ msg: 'server is running in production mode' }, 403);
		}
	},

	consent:function(req,res){
		return res.view();
	},

	acceptconsent:function(req,res)
	{
		var now = new Date();
		User.update({id:req.session.passport.user.id},{consent:now}).exec(function(err){
			req.session.passport.user.consent = now;
			if (!req.session.ismobile) {
				res.redirect('/dashboard');
			}
			else
			{
				res.redirect('/auth/sessionkey');				
			}
		});
	}
};
