module.exports.routes = {
  "get /": "AuthController.login",
  "get /getstarted": "AuthController.getstarted",
  "get /consent": "AuthController.consent",
  "get /acceptconsent": "AuthController.acceptconsent",
  "get /v/:shortlink?": "WatchController.shortlink",
  "get /s/:shortlink?": "EventController.shortlink",
  "get /b/:shortlink?": "EventController.shortlink",
  "get /stories": "WatchController.index",
  // 'get /stories/view/:id?/:edit?': 'WatchController.view',
  "get /auth/mobilelogin/:id?": "AuthController.mobilelogin",
  "get /status": "AuthController.status",
  "get /auth": "AuthController.login",
  "get /event/view/:id?": "EventController.view",
  "get /shoot/:id?": "ShootController.index",
  "get /terms": "StaticController.terms",
  "get /privacy": "StaticController.privacy",
  "get /join/:id?": "AuthController.join",
  "post /joincode": "AuthController.joincode",
  "get /joincomplete": "AuthController.joincomplete",
  "get /dashboard": "EventController.dashboard",
  "get /commission/new": "CommissionController.new",
  "get /commission/:id?": "CommissionController.index",
  "get /post/:id?": "PostController.index",
  "get /auth/local": "AuthController.local",
  "post /auth/locallogin": "AuthController.process_local",
  "post /event/map/:id/:role": "EventController.map",
  "get /event/backgroundurl": "EventController.backgroundurl",
  "get /event/roleimg/:id/:role?": "EventController.roleimg",
  "get /event/clearroleimg/:id/:role": "EventController.clearroleimg",
  "get /event/contributors/:id": "EventController.contributors",
  "post /auth/process_admin": "AuthController.process_admin",
  "get /admin/clearbranding": "EventController.clearbranding",
  "post /admin/branding": "EventController.branding",

  /*
    API ENDPOINTS
    */
  "get /api/event/lookupshoot/:shortlink?": "EventController.lookupshoot",
  "post /api/watch/editupdates": "WatchController.editupdates",
  "get /api/event/myevents": "EventController.myevents",
  "get /api/event/myeventsowned": "EventController.myeventsowned",
  "get /api/event/removelimit/:id?": "EventController.removelimit",
  "get /api/event/restorelimit/:id?": "EventController.restorelimit",
  "get /api/event/image/:id?": { uploadLimit: "4mb" },
  "post /api/post/remind": "PostController.remind",
  "post /api/post/broadcast": "PostController.broadcast",
  "post /api/post/module_function": "PostController.module_function",
  "get /api/post/module/:id?": "PostController.module",
  "get /api/post/getnumbers": "PostController.getnumbers",
  "get /api/post/document": "PostController.document",
  "post /api/post/canceldownload": "PostController.canceldownload",
  "get /api/post/downloadprogress": "PostController.downloadprogress",
  "get /api/post/myoutputtemplates": "PostController.myoutputtemplates",
  "post /api/post/downloadall": "PostController.downloadall",
  "post /api/post/updateoutputs": "PostController.updateoutputs",
  "post /api/commission/addshot/:id?": "CommissionController.addshot",
  "get /api/commission/example": "CommissionController.example",
  "post /api/commission/update": "CommissionController.update",
  "get /api/commission/info": "CommissionController.info",
  "get /api/commission/templateinfo/:id": "CommissionController.templateinfo",
  "get /api/commission/allshots": "CommissionController.allshots",
  "post /api/commission/updateshots": "CommissionController.updateshots",
  "get /api/event/registercode/:code?": "EventController.registercode",
  "post /api/log": "ApiController.log",

  // 'get /api/backup':'ApiController.backup',
  // 'post /api/restore':'ApiController.restore',
  "get /api/backupusb": "ApiController.backupusb",
  "get /api/restoreusb": "ApiController.restoreusb",
  "get /api/copyprogress": "ApiController.getcopyprogress",

  //info
  "get /api/status": "AuthController.status",

  //login
  "get /api/auth/login": "AuthController.apilogin",
  //logout
  "get /api/auth/logout": "AuthController.apilogout",
  //anon login
  "get /api/auth/anon": "AuthController.fakejson",

  //list shots
  "get /api/commission/shots": {
    controller: "CommissionController",
    action: "allshots",
    policy: "apiauth",
    cors: true,
  },
  //get template
  "get /api/commission/gettemplate/:id?": {
    controller: "CommissionController",
    action: "templateinfo",
    policy: "apiauth",
    cors: true,
  },
  //update template
  "post /api/commission/update/:id?": {
    controller: "CommissionController",
    action: "update",
    policy: "apiauth",
    cors: true,
  },
  //update shots live
  "post /api/commission/updateshots/:id?": {
    controller: "CommissionController",
    action: "updateshots",
    policy: "apiauth",
    cors: true,
  },
  //list seed templates
  "get /api/commission/seedtemplates": {
    controller: "CommissionController",
    action: "seedtemplates",
    policy: "apiauth",
    cors: true,
  },
  //get seed template
  "get /api/commission/getseedtemplate/:id?": {
    controller: "CommissionController",
    action: "getseedtemplate",
    policy: "apiauth",
    cors: true,
  },
  //my events
  "get /api/profile/mine": {
    controller: "EventController",
    action: "myevents",
    policy: "apiauth",
    cors: true,
  },
  //my profile details
  "get /api/profile/me": {
    controller: "EventController",
    action: "me",
    policy: "apiauth",
    cors: true,
  },

  //create new media
  "post /api/media/create": [
    { policy: "apiauth" },
    { policy: "apply_cors" },
    { controller: "MediaController", action: "addmedia" },
  ],

  "post /api/media/update/:id?": {
    controller: "MediaController",
    action: "update",
    policy: "apiauth",
    cors: true,
  },
  //upload media thumb
  // 'get /api/media/signuploadthumb/:id/:eventid': { controller: 'MediaController', action: 'uploadsignthumb', policy: 'apiauth', cors: true },
  "post /api/media/uploadthumbcomplete/:id?": {
    controller: "MediaController",
    action: "s3notifythumb",
    policy: "apiauth",
    cors: true,
  },
  //upload media file
  "get /api/media/signupload/:eventid": {
    controller: "MediaController",
    action: "uploadsign",
    policy: "apiauth",
    cors: true,
  },
  "post /api/media/uploadcomplete/:id?": {
    controller: "MediaController",
    action: "s3notify",
    policy: "apiauth",
    cors: true,
  },
  //get all media for event
  "get /api/media/shoot/:id?": [
    { policy: "apiauth" },
    { policy: "viewonly" },
    { policy: "apply_cors" },
    { controller: "MediaController", action: "nicejson" },
  ],

  //get all media for event
  "get /api/media/mymedia/:id?": [
    { policy: "apiauth" },
    { policy: "viewonly" },
    { policy: "apply_cors" },
    { controller: "MediaController", action: "mymedia" },
  ],
  //get thumbnail
  "get /api/media/thumbnail/:id": [
    { policy: "checkmedia" },
    { policy: "apply_cors" },
    { controller: "MediaController", action: "thumbnail" },
  ],
  "get /api/media/preview/:id": [
    { policy: "checkmedia" },
    { policy: "apply_cors" },
    { controller: "MediaController", action: "preview" },
  ],
  "get /api/media/full/:id": [
    { policy: "checkmedia_full" },
    { policy: "apply_cors" },
    { controller: "MediaController", action: "full" },
  ],
  "get /api/media/homog/:id": [
    { policy: "checkmedia_full" },
    { policy: "apply_cors" },
    { controller: "MediaController", action: "homog" },
  ],

  //get all media for event
  "post /api/post/newedit": {
    controller: "WatchController",
    action: "newedit",
    policy: "apiauth",
    cors: true,
  },
  "get /api/post/editprogress/:id?": {
    controller: "WatchController",
    action: "editprogress",
    policy: "apiauth",
    cors: true,
  },
  "get /api/post/myedits": {
    controller: "WatchController",
    action: "myedits",
    policy: "apiauth",
    cors: true,
  },

  "post /api/shoot/changephase/:id?": [
    { controller: "EventController", action: "changephase" },
    { policy: "apiauth" },
    { policy: "isowner" },
    { policy: "apply_cors" },
  ],
  "post /api/shoot/create": [
    { controller: "EventController", action: "addevent" },
    { policy: "apiauth" },
    { policy: "eventlimit" },
    { policy: "apply_cors" },
  ],
  // 'post /api/commission/createinstantshoot': [{ controller: 'CommissionController', action: 'createinstantshoot' }, { policy: 'apiauth' }, { policy: 'eventlimit' }, { policy: 'apply_cors' }],
  "get /api/shoot/updates/:id?": [
    { controller: "EventController", action: "updates" },
    { policy: "apiauth" },
    { policy: "isowner" },
    { policy: "apply_cors" },
  ],
  //connect to event

  "get /api/shoot/acceptrole": {
    controller: "EventController",
    action: "acceptrole",
    policy: "apiauth",
    cors: true,
  },
  "get /api/shoot/acceptshot": {
    controller: "EventController",
    action: "acceptshot",
    policy: "apiauth",
    cors: true,
  },
  "get /api/shoot/connect/:id?": {
    controller: "EventController",
    action: "subscribe",
    policy: "apiauth",
    cors: true,
  },
  "get /api/shoot/join/:id?": {
    controller: "EventController",
    action: "sub",
    policy: "apiauth",
    cors: true,
  },
  "get /api/shoot/registerpush/:id?": {
    controller: "EventController",
    action: "registerpush",
    policy: "apiauth",
    cors: true,
  },
  "get /api/shoot/selectrole": {
    controller: "EventController",
    action: "chooserole",
    policy: "apiauth",
    cors: true,
  },
  "get /api/shoot/startrecording": {
    controller: "EventController",
    action: "startrecording",
    policy: "apiauth",
    cors: true,
  },
  "get /api/shoot/stoprecording": {
    controller: "EventController",
    action: "stoprecording",
    policy: "apiauth",
    cors: true,
  },

  "get /api/profile/contributed": {
    controller: "EventController",
    action: "mycontributions",
    policy: "apiauth",
    cors: true,
  },
  "get /api/editing/alledits/:id?": {
    controller: "WatchController",
    action: "alledits",
    policy: "apiauth",
    cors: true,
  },
  "get /api/editing/music": {
    controller: "WatchController",
    action: "music",
    cors: true,
  },

  "get /api/watch/canceleditupdates": "WatchController.canceleditupdates",
  "get /api/watch/renderoriginal/:eventid/:id?":
    "WatchController.renderoriginal",
  "get /api/watch/rendertagged/:eventid/:id?": "WatchController.rendertagged",
  "get /api/watch/renderhq/:eventid/:id?": "WatchController.renderhq",
  "post /api/watch/savedit/:id?": "WatchController.saveedit",
  "post /api/watch/newedit/:id?": "WatchController.newedit",
  "post /api/watch/deleteedit/:id?": "WatchController.deleteedit",
  "get /api/watch/edits/:id?": "WatchController.edits",
  "get /api/watch/clone/:id?": "WatchController.cloneedit",
  "get /api/watch/changeownership/:id/:user": "WatchController.changeownership",
  "get /api/watch/getvideo/:id?": "WatchController.getvideo",
  "get /api/watch/getvideofull/:id?": "WatchController.getvideofull",
  "get /api/watch/getvideotags/:id?": "WatchController.getvideotags",
  "get /api/watch/getvideohq/:id?": "WatchController.getvideohq",
  "get /api/media/mediacount/:id?": "MediaController.mediacount",
  "get /api/media/mymedia/:id?": "MediaController.mymedia",
  "get /api/media/directorystructure/:id?":
    "MediaController.directorystructure",
  "get /api/event/admins/:id": "EventController.admins",
  "get /api/event/codes/:id": "EventController.codes",
  "post /api/event/edit/:id": "EventController.edit",
  "post /api/event/addcode": "EventController.addcode",
  "post /api/event/resendcode": "EventController.resendcode",
  "post /api/event/addadmin": "EventController.addadmin",
  "post /api/event/removeadmin": "EventController.removeadmin",
  "post /api/event/remcode": "EventController.remcode",
  "get /api/settings": "WatchController.getsettings",
  "post /api/settings/update/:name/:value": "WatchController.setting",
  "get /api/event/clone/:id": "CommissionController.clone",
  "get /api/transcribe/subs/:id?": "TranscribeController.subs",
  "/transcribe/:id?": "TranscribeController.index",
  "get /api/watch/edit/:id?": "WatchController.edit",
};
