/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
 /**
 * Check media access (full frame)
 */

function checkServerCode(req,res,cb)
{
  if (req.param('servertoken'))
  {
    //has a server token
    User.findOne({'apikey.servertoken':req.param('servertoken')}).exec(function(err,user){
      if (user)
      {
        //do headless login using this user:
        req.session.passport.user = user;
        return cb(req.session.passport.user.id);
      }
      else
      {
        return res.json(403,{msg:"Invalid server token"});
      }
    });
  }
  else
  {
	  if (req.session.passport && req.session.passport.user)
	  	cb(req.session.passport.user.id);
	  else
	    cb(null);
  }
}

module.exports = function (req, res, ok) {
	
	var id = req.param('id');

	checkServerCode(req,res,function(user)
	{

		//var user = req.session.passport.user.id;
		
		if (sails.config.LOCALONLY && (req.header('host') == 'localhost' || ((req.header('Referer')!=null) ? req.header('Referer').startsWith('http://localhost') || req.header('Referer').startsWith('http://offline.bootlegger.tv') : false)))
			return ok();

		if (!id || !user)
			return res.notFound(); 
		
		if (req.session.passport && req.session.passport.user && _.contains(sails.config.admin_email,req.session.passport.user.profile.emails[0].value))
			return ok();
		
		Media.findOne(id,function(err,media){
			
			if (media)
			{
				//if the user created the media:
				if (media.created_by == user)
					return ok();
				
				Event.findOne(media.event_id,function(err,shoot){
					if (!err && shoot)
					{
						//if the user is admin on the shoot for the media				
						if (_.contains(shoot.ownedby,user))
							return ok();
					}
					return res.notFound();				
				});
			}
			else
			{
				return res.notFound();
			}
		});
	});
}