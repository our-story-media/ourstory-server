/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
 /**
 * Event
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var JSZip = require("jszip");
var path = require('path');
var fs = require('fs');
var dir = __dirname + '../../../data/';	
var moment = require('moment');

module.exports = {

 attributes: {
	name: {
	    type: 'string',
	    required:true,
	    minLength: 5
	  },
	starts: {
	    required:true
	  },
    ends: {
	    required:true
	  },
	  eventtype: {
	    type: 'json'
	  },

	  calcphases:function()
	  {
	  	//console.log(this.starts);
	  	//console.log(moment(this.starts));

	  	if (this.commissiondone)
	  		this.iscommission = true;

	  	if (this.preparedone)
	  		this.isprepare = true;

	  	var starts = moment(this.starts,"DD-MM-YYYY");
	  	if (starts < moment())
	  	{
	  		this.iscommission = true;
	  		this.isprepare = true;
	  		this.isshoot = true;
	  	}
	
		//console.log(moment(this.ends,"DD-MM-YYYY"));
	  	var ends = moment(this.ends,"DD-MM-YYYY");
	  	if (ends < moment())
	  	{
	  		this.iscommission = true;
	  		this.isprepare = true;
	  		this.isshoot = true;
	  		this.ispost = true;
	  	}


	  },
	  
	  zipexists:function()
	  {
		dir = path.normalize(dir);
		// console.log("checking zip at "+dir+'/'+this.id+'.zip');
		// console.log("zip " + fs.existsSync(dir+'/'+this.id+'.zip'));
		return fs.existsSync(dir+'/'+this.id+'.zip');
	  },

	  genzip:function(cb)
	  {
		//   console.log("genzip " + this.id);
			dir = path.normalize(dir);
			// console.log(dir);
			var images = _.pluck(this.eventtype.shot_types,'image');
			var icons = _.pluck(this.eventtype.shot_types,'icon');

			var im_files = _.map(images,function(m)
			{
				return {source:dir+'images/'+m,target:m};
			});

			var ic_files = _.map(icons,function(m){
				return {source:dir+'icons/'+m,target:'icons/'+m}
			});

			var all = _.union(im_files, ic_files);

			var zip = new JSZip();
			_.each(all,function(f)
			{
				if (fs.existsSync(f.source))
				{
					try
					{
						zip.file(f.target, fs.readFileSync(f.source));
					}
					catch (e)
					{
						console.log(e);
					}
				}
				else
				{
					//missing file...
					sails.log.verbose('missing file: '+f.source);
				}
			});

			try
			{
				var outputfilename = dir + this.id + '.zip';
				zip.generateAsync({ type: "nodebuffer", compression: 'DEFLATE' })
				.then(function (content) {
					// use content
					// console.log('writing '+outputfilename);
					require("fs").writeFile(outputfilename, content, function (err) {
						if (err)
							console.log(err);
						cb();
					});
				});

				// require("fs").writeFile(dir+'/'+this.id+'.zip', content, function(err){
				// cb();
				// });
			}
			catch (e)
			{
				console.log(e);
				console.log('no file written');
				cb();
			}
			
	  }

    
  },

  afterCreate:function(newlyInsertedRecord, cb)
  {
  	Log.logModel('Event',newlyInsertedRecord.id);
  	cb();
  },

  findByListBuildVariant:function(req,events,cb)
  {
	  var currentbv = req.session.buildvariant;
	  if (currentbv.search_user)
	  {
		  Event.find({
			  id:events,
			  'ownedby': 
				{
					contains: currentbv.search_user
				}
				}).exec(cb);
	  }
	  else
	  {
		 Event.find(events).exec(cb);
	  }
  },

  findViaBuildVariant:function(req,cb){
	  var currentbv = req.session.buildvariant;
	  if (currentbv.search_user)
	  {
		  Event.find().where({
								public:[1,true],
								'ownedby': 
								{
									contains: currentbv.search_user
								}
							}).exec(cb);
	  }
	  else
	  {
	  	Event.find().where({public:[1,true]}).exec(cb);
	  }
  },

  findOwnedByBuildVariant:function(req,cb)
  {
	if (req.session.passport && req.session.passport.user)
	{
	  var currentbv = req.session.buildvariant;
	  if (currentbv.search_user)
	  {
		  cb(null,[]);
	  }
	  else
	  {
	  	Event.find().where({'ownedby': {
			contains: req.session.passport.user.id
		}}).exec(cb);
	  }
	}
	else
	{
		cb(null,[]);
	}
  },

  findInvitedByBuildVariant:function(req,cb)
  {
	if (req.session.passport && req.session.passport.user)
	{
		var currentbv = req.session.buildvariant;
		if (currentbv.search_user)
		{
			Event.find().where({
					'codes.uid':req.session.passport.user.id,
					'ownedby': 
					{
						contains: currentbv.search_user
					}
				}).exec(cb);
		}
		else
		{
			Event.find().where({'codes.uid':req.session.passport.user.id}).exec(cb);
		}
	}
	else
	{
		cb(null,[]);
	}
  },


  findFeaturedByBuildVariant:function(req,cb)
	{
		var currentbv = req.session.buildvariant;
		if (currentbv.search_user)
		{
			Event.find({where:{
				public:[1,true],
				'ownedby': 
				{
					contains: currentbv.search_user
				}
			},sort:'starts DESC',limit:12}).exec(cb);
		}
		else
		{
			
			Event.find({where:{public:[1,true]},sort:'starts DESC',limit:12}).exec(cb);
		}
	},

  findListByBuildVariant:function(req,events,cb)
  {
	  	var currentbv = req.session.buildvariant;
		if (currentbv.search_user)
		{
			Event.find({where:{
				id:events,
				'ownedby': 
				{
					contains: currentbv.search_user
				}
			}}).exec(cb);
		}
		else
		{
			Event.find(events).exec(cb);
		}
  },

  getnewcode:function(cb)
  {
  	//return a code unique across all events
  	var done = false;
  	var newcode = '';
  	//find list of codes...
  	Event.find().exec(function(err, events) {
		// Do stuff here
		var allcodes = new Array();

		//get all codes:
		_.each(events, function(ev)
		{
			_.each(ev.codes,function(c)
			{
				allcodes.push(c.code);
			});		  	
		});

		while (!done)
	  	{
			newcode = Math.floor((Math.random()*99999)).toString().substring(0,4);
			//find list of codes
			if (!_.contains(allcodes,newcode))
				done=true;
		}
		//console.log('newcode: '+newcode);
		cb(newcode);
	});
  },


};
