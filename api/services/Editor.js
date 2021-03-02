/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
 //edit file:
var uploaddir = "/upload/";
// var ss3 = require('s3');
var path = require('path');
var fs = require('fs');
var os = require('os');
var fivebeans = require('fivebeans');

var client = null;

exports.queuelength = function(cb)
{
	if (client==null)
	{
		client = new fivebeans.client(sails.config.BEANSTALK_HOST, sails.config.BEANSTALK_PORT);
		client.on('connect', function()
		    {
                client.use("edits", function(err, tubename) {
		            // client can now be used
                    client.stats_tube('edits', function(err, response) {
                        cb(response);
                    });	        
                });
		    })
		    .on('error', function(err)
		    {
		        // connection failure
		        sails.winston.error(err);
		    })
		    .on('close', function()
		    {
		        // underlying connection has closed
		    })
		    .connect();
	}
	else
	{
		client.stats_tube('edits', function(err, response) {
			cb(response);
		});	
	}
}

exports.audiosync = function(config) {
	if (client==null)
	{
		client = new fivebeans.client(sails.config.BEANSTALK_HOST, sails.config.BEANSTALK_PORT);
		client
		    .on('connect', function()
		    {
		        // client can now be used
		        client.use("edits", function(err, tubename) {
		        	sails.winston.info("Using the [edits] beanstalk tube");
		        	client.put(10, 0, 1000000000, JSON.stringify(['edits', {type:'audio',payload:config}]) , function(err, jobid) {
		        		if (!err)
		        			sails.winston.info("Audio Sync submitted");
		        		else
		        			sails.winston.error(err);
		        	});
		        });
		    })
		    .on('error', function(err)
		    {
		        // connection failure
		        sails.winston.error(err);
		    })
		    .on('close', function()
		    {
		        // underlying connection has closed
		    })
		    .connect();
	}
	else
	{
        client.use("edits", function(err, tubename) {
            client.put(10, 0, 1000000000, JSON.stringify(['edits', {type:'audio',payload:config}]), function(err, jobid) {
                if (!err)
                    sails.winston.info("Audio Sync submitted");
                else
                    sails.winston.error(err);
            });
        });
	}
}

exports.dropbox = function(config) {
	if (client==null)
	{
		client = new fivebeans.client(sails.config.BEANSTALK_HOST, sails.config.BEANSTALK_PORT);
		client
		    .on('connect', function()
		    {
		        // client can now be used
		        client.use("edits", function(err, tubename) {
		        	sails.winston.info("Using the [edits] beanstalk tube");
		        	client.put(10, 0, 1000000000, JSON.stringify(['edits', {type:'dropbox',payload:config}]) , function(err, jobid) {
		        		if (!err)
		        			sails.winston.info("Dropbox Transfer submitted");
		        		else
		        			sails.winston.error(err);
		        	});
		        });
		    })
		    .on('error', function(err)
		    {
		        // connection failure
		        sails.winston.error(err);
		    })
		    .on('close', function()
		    {
		        // underlying connection has closed
		    })
		    .connect();
	}
	else
	{
        client.use("edits", function(err, tubename) {
            client.put(10, 0, 1000000000, JSON.stringify(['edits', {type:'dropbox',payload:config}]), function(err, jobid) {
                if (!err)
                    sails.winston.info("Dropbox Transfer submitted");
                else
                    sails.winston.error(err);
            });
        });
	}
}

exports.edit = function(edit,mode) {
	edit.mode = mode || '';

	//just render original version (to halve the render time)
	if (sails.config.NOTRENDERTAGGED && edit.mode != 'tagged' && edit.mode != 'high')
		edit.mode='original';

	//just render tagged version (assuming original exists)
	// if (sails.config.NOTRENDERTAGGED && edit.forcerendertagged)
		// edit.mode='tagged';

	//render high quality version, assuming the system is set to render a lower quality version as default
	// if (sails.config.NOTRENDERTAGGED && edit.renderhighquality)
		//set to high-quality render mode
		// edit.mode='high';
	
	if (edit.mode == 'original')
	{
		//set to preview / lores output:
		if (sails.config.RENDERPROFILE)
			edit.profile = sails.config.RENDERPROFILE;
		
		if (sails.config.RENDERWIDTH)
			edit.width = sails.config.RENDERWIDTH;

		if (sails.config.RENDERHEIGHT)
			edit.height = sails.config.RENDERHEIGHT;
	}
		
	if (client==null)
	{
		
		client = new fivebeans.client(sails.config.BEANSTALK_HOST, sails.config.BEANSTALK_PORT);
		client
		    .on('connect', function()
		    {
		        // client can now be used
		        client.use("edits", function(err, tubename) {
		        	sails.winston.info("Using the [edits] beanstalk tube");
		        	client.put(10, 0, 1000000000, JSON.stringify(['edits', {type:'edit',payload:edit}]) , function(err, jobid) {
		        		if (!err)
		        			sails.winston.info("Edit submitted with id: "+ jobid + " / " + edit.code);
		        		else
		        			sails.winston.error(err);
		        	});
		        });
		    })
		    .on('error', function(err)
		    {
		        // connection failure
		        sails.winston.error(err);
		    })
		    .on('close', function()
		    {
		        // underlying connection has closed
		    })
		    .connect();
	}
	else
	{
        client.use("edits", function(err, tubename) {
            client.put(10, 0, 1000000000, JSON.stringify(['edits', {type:'edit',payload:edit}]), function(err, jobid) {
                if (!err)
                    sails.winston.info("Edit submitted with id: "+ jobid + " / " + edit.code);
                else
                    sails.winston.error(err);
            });
        });
	}
};
