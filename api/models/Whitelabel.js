/* Copyright (C) 2014 Newcastle University
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
 /**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
  schema:false,
  attributes: {
  	  name:'string',
      codename:'string',
      created_by:'string',
      search_user:'string',
      redirect_prot:'string',
      templates:'array'
  },

  afterCreate:function(newlyInsertedRecord, cb)
  {
  	Log.logModel('Whitelabel',newlyInsertedRecord.id);
  	cb();
  },
 
  getConfig:function(config,cb)
  {
    Whitelabel.findOne({codename:config}).exec(function(err,config){
        if (!err && config)
        {
            cb(null,config);
        }
        else
        {
            cb("Build variant not found",null);
        }
    });   
  },

  getDefaultConfig:function()
  {
      return {
          name:'Bootlegger',
          codename:'blgr',
          redirect_prot:'bootlegger'
      };
  }
};
