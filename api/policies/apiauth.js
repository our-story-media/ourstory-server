/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
 /*
UI Referrer Check (or API check)
*/


function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

const uuid = require('uuid');


function getBuildVariant(req,res,ok)
{
	/**
	 * WHITELABEL BUILD VARIANT
	 */
	if (req.param('cbid') && req.param('cbid') != 'bootlegger')
	{
		Whitelabel.getConfig(req.param('cbid'),function(err, config){
			if (!err)
			{
				req.session.buildvariant = config;
				return ok();
			}
			else
			{
				req.session.buildvariant = Whitelabel.getDefaultConfig();
				return ok();
			}
		});
	}
	else
	{
		req.session.buildvariant = Whitelabel.getDefaultConfig();
		return ok();			
	}
}

module.exports = function (req, res, ok) {
	//TODO: Stats and rate limiting on API calls
	//TODO: ip addresses on log
	//check header -- if its not from the ui (the right domain), then check against API keys (and increase stats)

	//Get build variant -- for Whitelabel apps
	getBuildVariant(req,res,function(){

		//check api-key:
		if (!req.param('apikey'))
		{
			return res.status(401).json({msg:'Please provide an API key'});
		}
		else
		{
			Utility.getRequestAction(req);
			Log.api({
				controller:req.options.controller,
				action:req.options.action,
				user_id:(req.session.passport && req.session.passport.user)?req.session.passport.user.id:'',
				apikey:req.param('apikey'), 
				params:req.allParams()
			});

			/**
			 * SYSTEM API KEYS
			 */
			
			//TO CHECK IF ITS THE WEBSITE
			if (req.session.CURRENT_API_KEY == req.param('apikey'))
				return ok();
				
			if (sails.config.CURRENT_EDIT_KEY == req.param('apikey'))
				return ok();

			//TO CHECK IF ITS THE MOBILE APP
			if (sails.config.CURRENT_MOBILE_KEY_IOS == req.param('apikey'))
				return ok();

			if (sails.config.CURRENT_MOBILE_KEY_PLAY == req.param('apikey'))
					return ok();

			if (sails.config.CURRENT_SYNCTRAY_KEY == req.param('apikey'))
				return ok();

			/**
			 * USER API KEYS
			 */
			User.findOne({'apikey.apikey':req.param('apikey')}).exec(function(error, u){
				//rate limit allowed for api (i.e. registered and agreed to the conditions)
				
				//check if calling to the correct endpoint:
				//console.log(req.path);
				//console.log(strStartsWith(req.path,'/api'));
				
				if (req.path)
					if (!strStartsWith(req.path,'/api'))
						return res.json(404,{msg:'Please use endpoints pre-fixed with /api/'})
				
				if (!u)
				{
					return res.status(401).json({msg:'Invalid API key'});
				}

				//console.log(req.path);

				if (!req.session.passport.user && req.path!='/api/auth/login')
				{
					if (req.param('servertoken'))
					{
						//has a server token
						if (u.apikey.servertoken == req.param('servertoken'))
						{
							//do headless login using this user:
							req.session.passport.user = u;
						}
						else
						{
							return res.status(403).json({msg:"Invalid server token"});
						}
					}
					else
					{
						return res.status(403).json({msg:'You need a valid signed in user or server token for the API'});
					}
				}

				if (u.apikey.apiaccess == 'live')
				{
					req.session.apikey = req.param('apikey');
					return ok();
				}
				else if (u.apikey.apiaccess == 'locked')
				{
					return res.status(403).json({msg:'Your API key has been disabled'});
				}
				else if (!u.apikey.apiaccess)
				{
					return res.status(401).json({msg:'You have not signed up for an API key. Signup at '+sails.config.master_url + '/api/signup'});
				}
			});
		}
	});
};
