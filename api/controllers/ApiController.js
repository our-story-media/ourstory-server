/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
// const path = require('path');
const uuid = require('uuid');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {

	index: function (req, res) {
		return res.json({ msg: 'Welcome to the API. Visit ' + sails.config.master_url + '/api/docs for documentation.' });
	},

	log: function (req, res) {
		//dummy ep to force log:
		return res.json({});
	},

	getkey: function (req, res) {
		User.findOne(req.session.passport.user.id).exec(function (err, u) {
			if (u.apikey) {
				return res.json(u.apikey);
			}
			else {
				return res.json({ msg: 'no valid key' });
			}

		});
	},

	backup: async function (req, res) {
		if (sails.config.LOCALONLY) {
			let ff = path.join(__dirname, '..', '..', 'upload','indaba.backup');
			// console.log(sails.config.connections.mongodb.url)
			try
			{
				const {err, stdout, stderr} = await exec(`mongodump --host mongo --db bootlegger --archive=${ff} --gzip`);
				res.setHeader("Content-Disposition",'attachment; filename="indaba.backup"');
				return res.sendfile(ff);
			}
			catch (e)
			{
				console.log(e);
				req.session.flash = {err:req.__('Problem Creating Backup')};
				return res.redirect('/event/admin/');
			}
		}
		else {
			return res.status(403);
		}
	},

	restore: function (req, res) {
		if (sails.config.LOCALONLY) {

			req.file('file').upload(async function (err, tt) {
				if (tt.length == 0) {
					req.session.flash = req.__('No file provided');
					return res.redirect('/event/admin/');
				}
				
				// console.log(tt[0].fd)
				let ff = '.tmp/uploads/' + tt[0].fd;
				if (_.startsWith(tt[0].fd,'/'))
					ff = tt[0].fd;

				// let ff = path.join(__dirname, '..', '..', 'upload','indaba.backup');
				// console.log(sails.config.connections.mongodb.url)
				try
				{
					const {err, stdout, stderr} = await exec(`mongorestore --host mongo --db bootlegger --drop --archive=${ff} --gzip`);
					// res.setHeader("Content-Disposition",'attachment; filename="indaba.backup"');
					// return res.sendfile(ff);
					// console.log('import complete')
					req.session.flash = {msg:'Import Complete'}
					res.redirect('/event/admin/');
				}
				catch (e)
				{
					console.log(e);
					req.session.flash = {err:req.__('Problem Restoring Backup')};
					return res.redirect('/event/admin/');
				}

						// res.redirect('/event/admin/');
				});
			}
			else {
			// console.log('no do')
			return res.status(403);
		}
	}

	// signup:function(req,res)
	// {
	// 	return res.view();
	// },

	// newkey:function(req,res)
	// {
	// 	User.findOne(req.session.passport.user.id).exec(function(err,u)
	// 	{
	// 		var apiobj = u.apikey;

	// 		if (apiobj.apiaccess == 'live')
	// 		{
	// 			apiobj.apikey = uuid.v4();
	// 		}

	// 		apiobj.apitype = 'redirect';

	// 		u.apikey = apiobj;

	// 		u.save(function(done)
	// 		{
	// 			return res.json({msg:'ok'});
	// 		});
	// 	});
	// },

	// servertoken:function(req,res)
	// {
	// 	User.findOne(req.session.passport.user.id).exec(function(err,u)
	// 	{
	// 		var apiobj = u.apikey;

	// 		if (apiobj.apiaccess == 'live')
	// 		{
	// 			apiobj.servertoken = uuid.v4();
	// 		}

	// 		u.apikey = apiobj;

	// 		u.save(function(done)
	// 		{
	// 			return res.json({msg:'ok'});
	// 		});
	// 	});
	// },

	// updateapi:function(req,res)
	// {
	// 	User.findOne(req.session.passport.user.id).exec(function(err,u)
	// 	{
	// 		u.apikey.apitype = req.param('apitype');
	// 		u.apikey.callbackfunction = req.param('callbackfunction');
	// 		u.apikey.redirecturl = req.param('redirecturl');

	// 		u.save(function(done)
	// 		{
	// 			return res.json({msg:'ok'});
	// 		});
	// 	});
	// },

	// revokeapi:function(req,res)
	// {
	// 	User.findOne(req.params.id).exec(function(err,user)
	// 	{
	// 		user.apikey.apiaccess = 'locked';
	// 		user.save(function(err,done){
	// 			return res.redirect('/event/admin');
	// 		});
	// 	});
	// },

	// unrevokeapi:function(req,res)
	// {
	// 	User.findOne(req.params.id).exec(function(err,user)
	// 	{
	// 		user.apikey.apiaccess = 'live';
	// 		user.save(function(err,done){
	// 			return res.redirect('/event/admin');
	// 		});
	// 	});
	// },

	// activate:function(req,res)
	// {
	// 	User.findOne(req.session.passport.user.id).exec(function(err,u)
	// 	{
	// 		//var apiobj = u.apikey || {apiaccess : 'live'};
	// 		//console.log(u);
	// 		if (typeof(u.apikey)=='undefined')
	// 		{
	// 			u.apikey = {};
	// 			req.session.passport.user.apikey = {apiaccess: 'live'};
	// 			u.apikey.apikey = uuid.v4();
	// 			u.apikey.apiaccess = 'live';
	// 			u.apikey.apitype = 'redirect';
	// 		}

	// 		u.save(function(done)
	// 		{
	// 			return res.json({msg:'ok'});
	// 		});
	// 	});
	// }

};
