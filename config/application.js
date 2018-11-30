var passport = require('passport');
var _ = require('lodash');
var device = require('express-device');

module.exports = {
	
	// Name of the application (used as default <title>)
	appName: "Bootlegger",

	// Logger
	// Valid `level` configs:
	// 
	// - error
	// - warn
	// - debug
	// - info
	// - verbose
	//
	log: {
		level: 'info'
	},

	http: { 
        customMiddleware: function(app){
          //console.log('Express midleware for passport');
          app.use(passport.initialize());
          app.use(passport.session());

          app.use(device.capture());
          device.enableDeviceHelpers(app);
        }},

};