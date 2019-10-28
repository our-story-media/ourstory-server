/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
// const path = require('path');
const uuid = require('uuid');



module.exports = {

	getcopyprogress: function (req, res) {
		return res.json({ progress: Backup.copyprogress });
	},

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

	backupusb: function (req, res) {
		if (sails.config.LOCALONLY) {

			if (Backup.backuprunning) {
				req.session.flash = { err: req.__('Backup or Restore already running') };
				return res.redirect('/event/admin/');
			}

			try {
				//create mongo dump:

				Backup.backup();

				req.session.flash = { msg: req.__('Backup Initiated') };

				return res.redirect('/event/admin/');
			}
			catch (e) {
				console.log(e);
				req.session.flash = { err: req.__('Problem Initiating Backup') };
				return res.redirect('/event/admin/');
			}
		}
		else {
			return res.status(403);
		}
	},

	restoreusb: function (req, res) {
		if (sails.config.LOCALONLY) {

			let source = req.param('source');

			if (Backup.backuprunning) {
				req.session.flash = { err: req.__('Backup or Restore already running') };
				return res.redirect('/event/admin/');
			}

			try {
				
				Backup.restore(source);
				req.session.flash = { msg: req.__('Restore Initiated') }
				res.redirect('/event/admin/');
			}
			catch (e) {
				console.log(e);
				req.session.flash = { err: req.__('Problem Initiating Restore') };
				return res.redirect('/event/admin/');
			}
		}
		else {
			return res.status(403);
		}
	}
};
