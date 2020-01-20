/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
 /**
 * Check media access
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
		// console.log(req.session.passport.user);
	  if (req.session.passport && req.session.passport.user)
	  	cb(req.session.passport.user.id);
	  else
	    cb(null);
  }
}

module.exports = function (req, res, ok) {
	
// console.log("thumb check 2");

	var id = req.param('id');
	//var user = req.session.passport.user.id;
	
	checkServerCode(req,res,function(user)
	{

		// console.log("user",user);
		// console.log(req.headers);
		if (sails.config.LOCALONLY && (req.header('host') == 'localhost' || ((req.header('Referer')!=null) ? req.header('Referer').startsWith('http://localhost') || req.header('Referer').startsWith('http://offline.bootlegger.tv') : false)))
			return ok();

		// console.log(id);
		// console.log(user);

		// console.log(req.session.passport.user);
		

		if (!id || !user)
			return res.forbidden();
	
		
		

		if (req.session.passport && req.session.passport.user.localadmin)
			return ok();

		if (req.session.passport && req.session.passport.user && _.includes(sails.config.admin_email,req.session.passport.user.profile.emails[0].value))
		{
			return ok();
		}

		// console.log(req.session.passport.user.profile.emails[0].value);
		
		Media.findOne(id,function(err,media){
			// console.log(err);
			if (media)
			{

				//if the user created the media:
				if (media.created_by == user)
					return ok();
				
				Event.findOne(media.event_id,function(err,shoot){
					if (!err && shoot)
					{
						//if the user is admin on the shoot for the media				
						if (_.includes(shoot.ownedby,user))
							return ok();
						
						//if the user is a contributor to the shoot and the shoot allows viewing
						Media.isContributor(user,shoot.id,function(yes){
							if (yes || shoot.publicview || shoot.publicedit)
								return ok();
							else
								return res.forbidden();
						});
					}
					else
					{
						console.log('Media has no shoot information ' + media.id);
						return res.notFound();
					}
				});
			}
			else
			{
				console.log('media not found ' + id);
				return res.notFound();
			}
		});
	});
}