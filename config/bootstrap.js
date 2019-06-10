/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var fs = require('fs');
// var Server = require('node-ssdp').Server;

module.exports.bootstrap = function (cb) {
	//start http redirect server:

	var request = require('request');

	var myIP = require('my-ip');

	sails.winston = require('winston');
	sails.winston.remove(sails.winston.transports.Console);
	sails.winston.add(sails.winston.transports.Console, { colorize: true, level: 'info' });
	require('winston-mongodb').MongoDB;

	// var dbconn = 'mongodb://'+sails.config.connections.mongodb.user+((sails.config.connections.mongodb.password)?':'+sails.config.connections.mongodb.password:'')+'@'+sails.config.connections.mongodb.host+':'+sails.config.connections.mongodb.port+'/'+sails.config.connections.mongodb.database;

	sails.winston.add(sails.winston.transports.MongoDB, {
		level: 'verbose',
		db: sails.config.connections.mongodb.url,
		collection: 'log',
		storeHost: true,
		//handleExceptions: true
	});

	//check variables are set:
	if ((sails.config.google_clientid == "googleid")) {
		Log.error("config", "*** Enter Google OAuth Details in .sailsrc ***");
		throw new Error('OAuth Config Error');
	}

	//console.log(sails.config.admin_email);

	//check admin emails:
	if (sails.config.admin_email.length == 0) {
		Log.error("config", "*** Add a super admin email address in .sailsrc ***");
		throw new Error('No Admin Email Address Set');
	}

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

	Log.info('bootstrap', "Connected to MongoDB on " + sails.config.connections.mongodb.host);

	//sails.winston.remove(sails.winston.transports.Console);
	// Log.info('bootstrap', 'started', { local: sails.config.LOCALONLY });

	// insert default settings:
	Settings.findOne({name:'processedits'}).exec(function(err,data){
		// console.log(data);
		if (!data)
		{
			Settings.create({ name: 'processedits',value:false }).exec(function(){
				Log.info('bootstrap', 'Added Init Settings', { local: sails.config.LOCALONLY });
			});
		}
	});

	/**
	 * GDPR User Sanitisation
	 */

	User.native(function (err, collection) {
		collection.update({},
			{
				"$unset": {
					"profile.gender": true,
					"profile._json": true,
					"profile._raw": true
				}
			},
			{
				multi: true
			}, function (err) {
				// console.log(err);
				Log.info('bootstrap', 'Unset Extra User Data');
			});
	});

	Event.native(function (err, collection) {
		collection.update({},
			{
				"$unset": {
					"apikey": true
				}
			},
			{
				multi: true
			}, function (err) {
				// console.log(err);
				Log.info('bootstrap', 'Unset Event API Key');
			});
	});

	if (sails.config.LOCALONLY)
		Log.info('bootstrap', `Loading LOCAL_MODE`);

    /**
     * FIRST INSTALL SCRIPTS
     */
	try {
		Shot.find({}).exec(function (err, shots) {
			// sails.log.error(err);
			if (shots) {
				if (shots.length == 0) {
					Shot.create(JSON.parse(fs.readFileSync('assets/allshots.json'))).exec(function (err, done) {
						Log.info('bootstrap', 'Init Shots');
					});
				}
				else {
					_.each(shots, function (s) {
						//console.log('assets/data/images/'+s.image);
						if (!fs.existsSync('data/images/' + s.image)) {
							Log.error('bootstrap', 'Missing Large ' + s.image);
						}

						if (!fs.existsSync('data/icons/' + s.icon)) {
							Log.error('bootstrap', 'Missing Small ' + s.icon);
						}
					});
				}
			}
		});

		EventTemplate.find({}).exec(function (err, evs) {
			if (evs) {
				if (evs.length == 0) {
					EventTemplate.create(JSON.parse(fs.readFileSync('assets/alltemplates.json'))).exec(function (err, done) {
						Log.info('bootstrap', 'Init Templates');
					});

					if (!sails.config.LOCALONLY) {
						//update default backgrounds to s3:
						var ss3 = require('s3');
						var s3 = ss3.createClient({
							s3Options: {
								accessKeyId: sails.config.AWS_ACCESS_KEY_ID,
								secretAccessKey: sails.config.AWS_SECRET_ACCESS_KEY,
								region: sails.config.S3_REGION
							},
						});
						var params = {
							localDir: __dirname + '/../assets/backgrounds/',
							s3Params: {
								Bucket: sails.config.S3_BUCKET,
								Prefix: "upload/backgrounds/",
								ACL: 'public-read'
							},
						};
						var uploader = s3.uploadDir(params);
						uploader.on('error', function (err) {
							console.error("unable to sync:", err.stack);
							Log.error('bootstrap', 'Default Image Sync Error', err);
						});
						uploader.on('progress', function () {
							process.stdout.write("Default backgrounds upload: " + ((uploader.progressAmount / uploader.progressTotal) * 100).toString().substr(0, 4) + "%\r")
						});
						uploader.on('end', function () {
							Log.info('bootstrap', 'Default Image Sync Complete');
						});
					}
				}
			}
		});

		//checkfix old server media links
		Media.find({
			thumb: {
				'startsWith': 'http://bootlegger.s3.amazonaws.com'
			}
		}).exec(function (err, media) {
			_.each(media, function (m) {
				if (m.thumb) {
					m.thumb = m.thumb.replace('http://bootlegger.s3.amazonaws.com', '');
					m.save(function (err, done) {
						//done 
					});
				}
			});
		});

		if (sails.config.LOCALONLY) {
			Whitelabel.find({}).exec(function (err, wl) {
				// console.log(wl);
				if (wl.length == 0) {
					Whitelabel.create({
						"name": "Offline",
						"codename": "offline",
						"redirect_prot": "offline"
					}).exec((err) => {
						Log.info('bootstrap', 'Added offline WhiteLabel config');
					});
				}
			});
		}
	}
	catch (e) {
		Log.error(e);
	}

    /**
     * END INSTALL SCRIPTS
     */

	//start passport authentication
	var passport = require('passport');
	var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
	var LocalStrategy = require('passport-local').Strategy;
	// var FacebookStrategy = require('passport-facebook').Strategy;
	// var TwitterStrategy = require('passport-twitter').Strategy;
	var DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy;

	passport.use(new LocalStrategy(
		function (username, password, done) {
			User.findOne({
				username: username,
				password: password
			}, function (err, user) {
				return done(err, user);
			});
		}
	));

	var protocol = (_.contains(process.argv, '--prod') ? 'https' : 'http');

	if (!sails.config.LOCALONLY) {
		passport.use(new DropboxOAuth2Strategy({
			apiVersion: '2',
			clientID: sails.config.dropbox_clientid,
			clientSecret: sails.config.dropbox_clientsecret,
			passReqToCallback: true,
			callbackURL: sails.config.master_url + '/auth/dropbox_return'
		},
			function (req, accessToken, refreshToken, profile, done) {
				Log.info('dropbox', 'Login', { user_id: req.session.passport.user.id });
				req.session.passport.user.dropbox = {};
				req.session.passport.user.dropbox.id = profile.id;
				req.session.passport.user.dropbox.refreshToken = refreshToken;
				req.session.passport.user.dropbox.accessToken = accessToken;
				return done(null, req.session.passport.user);
			}
		));

		passport.use(new GoogleStrategy({
			clientID: sails.config.google_clientid,
			clientSecret: sails.config.google_clientsecret,
			callbackURL: sails.config.master_url + '/auth/google_return',
		},
			function (token, tokensecret, profile, done) {
				//console.log(profile);
				// profile._json.picture = profile.photos[0].value.replace('?sz=50', '');
				var sn_profile = {
					"id": profile.id,
					"displayName": profile.displayName,
					"provider": profile.provider,
					"photos": [
						{
							"value": profile.photos[0].value
						}
					],
					"emails": [
						{
							"value": profile.emails[0].value
						}
					]
				};

				// console.log(sn_profile);

				User.findOrCreate({ uid: String(profile.id) }, { uid: String(profile.id), profile: sn_profile }).exec(function (err, user) {

					// console.log(user);
					Log.info('google', 'Login', { user_id: profile.id });

					user.profile.photos = sn_profile.photos;
					user.save(function(err){
						return done(err, user);
					});
				});
			}
		));

		// passport.use(new FacebookStrategy({
		// 	clientID: sails.config.FACEBOOK_APP_ID,
		// 	clientSecret: sails.config.FACEBOOK_APP_SECRET,
		// 	callbackURL: sails.config.master_url + '/auth/facebook_return',
		// 	profileFields: ['id', 'name', 'picture.type(small)', 'emails', 'displayName']
		// },
		// 	function (token, tokensecret, profile, done) {
		// 		//console.log(profile);
		// 		Log.info('facebook', 'Login', { user_id: profile.id });
		// 		// profile._json.picture = 'http://graph.facebook.com/' + profile.id + '/picture';

				
		// 		if (profile.emails) {

		// 			var sn_profile = {
		// 				"id": profile.id,
		// 				"displayName": profile.displayName,
		// 				"provider": profile.provider,
		// 				"photos": [
		// 					{
		// 						"value": profile.photos[0].value
		// 					}
		// 				],
		// 				"emails": [
		// 					{
		// 						"value": profile.emails[0].value
		// 					}
		// 				]
		// 			};

		// 			User.findOrCreate({ uid: String(profile.id) }, { uid: String(profile.id), profile: sn_profile }, function (err, user) {
		// 				user.profile.photos = sn_profile.photos;
		// 				user.save(function(err){
		// 					return done(err, user);
		// 				});
		// 			});
		// 		}
		// 		else {
		// 			return done(null, false, { message: 'Please allow Bootlegger access to your email address!' });
		// 		}
		// 	}
		// ));
	}

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (user, done) {
		done(null, user);
	});

	// if (!sails.config.git_version) {
	// 	sails.log.verbose('No GIT repo installed here');
	// 	sails.config.git_version = {
	// 		branch: 'production',
	// 		date: '?',
	// 		time: '?',
	// 		message: '?'
	// 	};
	// }

	// cb();

	// sails.localmode = false;
	// if (sails.config.LOCALONLY) {
		//startup the event manager:
	sails.hostname = sails.config.hostname + ':' + sails.config.port;
	sails.multiserveronline = false;
	sails.eventmanager = require('./eventmanager.js');
	sails.eventmanager.init(sails, function () {
		cb();
	});
	// }
	// else {
	// 	//not local -- tell the central server to reload events:
	// 	// Log.info('bootstrap', "Signing on with Multi-Control Server");
	// 	sails.hostname = sails.config.hostname + ':' + sails.config.port;
	// 	Log.info('bootstrap', "Current Hostname is " + sails.hostname);
	// 	sails.multiserveronline = false;
	// 		//startup the event manager:
	// 	sails.eventmanager = require('./eventmanager.js');
	// 	sails.eventmanager.init(sails, function () {
	// 		cb();
	// 	});
	// 	// });
	// }
};
