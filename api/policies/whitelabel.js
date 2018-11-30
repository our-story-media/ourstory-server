/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
 /*
Whitelabel session setting
*/

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
	//Get build variant -- for Whitelabel apps
	getBuildVariant(req,res,function(){
        return ok();
    });
}