/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
const fs = require('fs');
const path = require('path');
const markdown = require('marked');

module.exports = {	
	terms:function(req,res)
	{
		//var markdown = require('marked');
		var contents = fs.readFileSync(path.normalize(__dirname+'/../../views/static/terms.md'),"utf8");
		//console.log(contents);
		var themarkdown = markdown(contents);
		return res.view('static/markdown',{markdown:themarkdown});
	},

	privacy:function(req,res)
	{
		//var markdown = require('marked');
		var contents = fs.readFileSync(path.normalize(__dirname+'/../../views/static/privacy.md'),"utf8");
		//console.log(contents);
		var themarkdown = markdown(contents);
		return res.view('static/markdown',{markdown:themarkdown});
	}
}