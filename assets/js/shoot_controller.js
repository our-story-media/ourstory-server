'use strict';

var minutesOfDay = function(m){
  return m.minutes() + m.hours() * 60;
};

function getProperty(obj, prop) {
    var parts = prop.split('.'),
        last = parts.pop(),
        l = parts.length,
        i = 1,
        current = parts[0];

    while((obj = obj[current]) && i < l) {
        current = parts[i];
        i++;
    }

    if(obj) {
        return obj[last];
    }
}

bootleggerApp.config(['paginationTemplateProvider', function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('/dirPagination.tpl.html');
}]);

bootleggerApp.config(['uiGmapGoogleMapApiProvider',function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: GOOGLE_MAPS_KEY,
        libraries: 'geometry,visualization',
    });
}]);

bootleggerApp.filter('seconds', function() {
  return function(input) {
    var lena = input.split(':');
    var time = (parseInt(lena[0])*3600) + (parseInt(lena[1])*60) + (parseFloat(lena[2]));
    return time;
  };
})

bootleggerApp.filter('rangeFilter', function() {
    return function( items, rangeInfo ) {
        var filtered = [];
        if (rangeInfo == undefined)
          return items;
        var min = parseInt(rangeInfo.minValue);
        var max = parseInt(rangeInfo.maxValue);
        if (max == 100)
          max = 100000;
        // If time is with the range
        angular.forEach(items, function(item) {
          try
          {
              var lena = item.meta.static_meta.clip_length.split(':');
              var time = (parseInt(lena[0])*3600) + (parseInt(lena[1])*60) + (parseFloat(lena[2]));
              //console.log(time);
                if( time >= min && time <= max ) {
                    filtered.push(item);
                }
                
                if (isNaN(time))
                  filtered.push(item);
          }
          catch (e)
          {
            filtered.push(item);
          }
        });
        return filtered;
    };
});

bootleggerApp.filter('timeFilter', function() {
    return function( items, times ) {
        var filtered = [];
        if (times.from == undefined || times.to == undefined)
          return items;
        var min = minutesOfDay(moment(times.from));
        var max = minutesOfDay(moment(times.to));
        // If time is with the range
        angular.forEach(items, function(item) {
          //var lena = item.meta.static_meta.clip_length.split(':');
          //var time = (parseInt(lena[0])*3600) + (parseInt(lena[1])*60) + (parseFloat(lena[2]));
          var time = moment(item.meta.static_meta.captured_at+':00','DD-MM-YYYY hh:mm:ss.SS a Z');
          
            if(minutesOfDay(time) >= min && minutesOfDay(time) <= max ) {
                filtered.push(item);
            }
        });
        return filtered;
    };
});

bootleggerApp.filter('checkFilter', function() {
    return function( items, params ) {
        var filtered = [];
        if (params.value == undefined || params.value.length == 0)
          return items;
        // If time is with the range
        angular.forEach(items, function(item) {
          if (_.contains(params.value,getProperty(item, params.name)))
            filtered.push(item);
        });
        return filtered;
    };
});

bootleggerApp.filter('areaFilter', function() {
    return function( items, params ) {
        var filtered = [];
        if (params.circle == undefined || params.filterbylocation == false)
          return items;
        // If time is with the range
        angular.forEach(items, function(item) {
          var latLng = new google.maps.LatLng(item.meta.static_meta.gps_lat,item.meta.static_meta.gps_lng);
          if (params.circle.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(params.circle.getCenter(), latLng) <= params.circle.radius)
            filtered.push(item);
        });
        return filtered;
    };
});

bootleggerApp.filter('hasVideoFilter', function() {
    return function( items, params ) {
        var filtered = [];
        // If time is with the range
        angular.forEach(items, function(item) {
          if ((params && item.path) || params==false)
            filtered.push(item);
        });
        return filtered;
    };
});

bootleggerApp.filter('deletedFilter', function() {
    return function( items, params ) {
        var filtered = [];
        // If time is with the range
        angular.forEach(items, function(item) {
          if ((params && item.deleted) || (!params && !item.deleted))
            filtered.push(item);
        });
        return filtered;
    };
});

bootleggerApp.filter('hasEditTag', function() {
    return function( items, params ) {
        var filtered = [];
        // If time is with the range
        angular.forEach(items, function(item) {
          if ((params && item.meta.static_meta.edit_tag) || params==false)
            filtered.push(item);
        });
        return filtered;
    };
});

bootleggerApp.filter('topicFilter', function() {
  return function( items, params ) {
      var filtered = [];
      // If time is with the range
      angular.forEach(items, function(item) {
        if ((params && item.meta && item.meta.static_meta && item.meta.static_meta['-topics']))
        {
          var t = item.meta.static_meta['-topics'].split(',');
          if (_.union(t,params).length > 0)
            filtered.push(item);
        }
        else
        {
          if(params==false)
            filtered.push(item);
        }
      });
      return filtered;
  };
});

// 1.3.0-beta.19+
bootleggerApp.filter("as", function($parse) {
  return function(value, context, path) {
    return $parse(path).assign(context, value);
  };
});

bootleggerApp.controller('Live',['$scope','$bootleggerSails','uiGmapGoogleMapApi','$timeout','$sce','usSpinnerService','$interval','uiGmapIsReady','$window', function ($scope,socket,uiGmapGoogleMapApi,$timeout,$sce,usSpinnerService,$interval,uiGmapIsReady,$window) {
  //var controller = this;
  $scope.API = null;
  $scope.candelete = false;
  $scope.edit_tag =false;


  $scope.tracks = [];
  
  $scope.tracks.push({name:'track 1',items:[]});
  $scope.tracks.push({name:'track 2',items:[]});
  $scope.tracks.push({name:'track 3',items:[]});
  $scope.tracks.push({name:'track 4',items:[]});
  $scope.masterpix = 5;

  $scope.dirtyflag = false;

  $scope.lastsaved = new Date();
  $scope.getClipLength = function(clip)
  {
    var lena = clip.meta.static_meta.clip_length.split(':');
    var time = (parseInt(lena[0])*3600) + (parseInt(lena[1])*60) + (parseFloat(lena[2]));
    return time;
  }

  $scope.saveTimeline = function()
  {
    //save tracks to the shoot, with only media and offset information...
    var data = _.clone($scope.tracks,true);
    _.each(data,function(d){
      d.items = _.map(d.items,function(i){
        var nm = {
          offset:i.offset,
          track:i.track,
          id:i.id
        };
        return nm;
      });
    });
    
     socket.get('/shoot/updatetimeline/'+mastereventid,{tracks:data}).then(function(resp){
       $scope.dirtyflag = false;
        $scope.lastsaved = new Date();
     });
    
  }

$scope.currentm = null;
$scope.isdragging = false;




  $scope.dothisondrop = function(event,ui)
  {
    $scope.isdragging = false;    
    
    if (typeof($(ui.draggable[0]).data('track')) != 'undefined')
    {
      //console.log($(ui).scope());
      var t = $(ui.draggable[0]).data('track');
      var i = $(ui.draggable[0]).data('index');
      
      var obj = $scope.tracks[t].items[i];
      
      
      
      var target = $(event.toElement).data('index');
      if (t != target && $scope.tracks[target]){
         $scope.tracks[t].items.splice(i,1);
          obj.left = ui.position.left; 
          obj.offset = ui.position.left / $scope.masterpix;
          obj.track = t;
          //console.log(obj.left);
          $scope.tracks[target].items.push(obj);
             
          //put in target track...
      }
      else{
        //remove from timeline...
         $scope.tracks[t].items.splice(i,1);
         var obj = _.find($scope.media,{id:$(ui.draggable[0]).data("media-id")});
         $scope.tag(obj);
      }
    }
    else if (typeof($(ui.draggable[0]).data('masterindex')) !='undefined' )
    {
      var target = $(event.target).data('index');
      var id = $(ui.draggable[0]).data('id');
      
      var obj = _.clone(_.find($scope.media,{id:id}));
      
      $scope.tag(obj);
      
      obj.left = ui.position.left;
      obj.track = t;
      obj.offset = ui.position.left / $scope.masterpix;
      $scope.tracks[target].items.push(obj);
    }
    
    $scope.saveTimeline();
    $scope.dirtyflag = true;
  }
  
  $scope.dothisondrag = function(event,ui)
  {
     $scope.isdragging = true;
    //console.log(event);
     var t = $(ui.helper[0]).data('track');
     var i = $(ui.helper[0]).data('index');  
     var obj = $scope.tracks[t].items[i];
     obj.offset = ui.position.left / $scope.masterpix;
     obj.track = t;
  }



  $scope.filteredmedia = [];

  $scope.onPlayerReady = function(API) {
    $scope.API = API;
  };

  $scope.deletemode = function()
  {
    $scope.candelete = !$scope.candelete;
  };

  $scope.editing = false;

  $scope.start = function(editing)
  {
    $scope.editing = editing;
  }

  $scope.pixsecs = 15;

  $scope.mapshown = true;
  $scope.crewshow = true;
  $scope.filtershow = false;
  $scope.controlshow = false;
  $scope.timefilterfrom = null;
  $scope.timefilterfrom = null;
  $scope.filterbylocation = false;

  $scope.sources = [];

  $scope.log = function(didthis,params)
  {
    socket.post('/log/click/', {eventid:mastereventid, event:didthis, page:'shoot',extras:params});
  };

  $scope.showMap = function() {
    $scope.mapshown = !$scope.mapshown;
  };
  
   $scope.showControls = function() {
    $scope.controlshow = !$scope.controlshow;
  };
   $scope.showlocation = function() {
    $scope.filterbylocation = !$scope.filterbylocation;
  };

  $scope.playThis = function(vid) {
    if (!$scope.isdragging)
    {
      vid.lowres = vid.lowres.replace(master_url,'');
      console.log(vid.lowres);
      $scope.sources = [{src: $sce.trustAsResourceUrl(vid.lowres), type: "video/mp4"}];
      $('#playAll').on('hide.bs.modal', function (e) {
        $timeout($scope.API.stop.bind($scope.API), 100);
        $scope.log('pause',{media:vid.id});
      });
      $('#playAll').modal('show');
      $scope.$apply;
      $timeout($scope.API.play.bind($scope.API), 100);

      $scope.log('play',{media:vid.id});
    }
    };

  $scope.format = function(key,val)
  {
    if (key=="gps_lng")
    {
      return '<span class="meta gps"> GPS location</span>';
    }
    if (key=="server_shot")
    {
      return '';
    }
    if (key=="filesize")
    {
      return '<span class="meta filesize">'+parseInt(val)/1024+'MB</span>';
    }
    if (key=="role_ex")
    {
      return '<span class="meta role">'+val.name+'</span>';
    }
     if (key=="shot_ex")
    {
      return '<span class="meta shot">'+val.name+'</span>';
    }
    if (key=="coverage_class_ex")
    {
      return '<span class="meta coverage">'+ val.name +'</span>';
    }
    if (key=="shot_meta" && val!=null)
    {
      return '<span class="meta shot_meta">'+val+'</span>';
    }

    if (key=="meta_phase" && val!='null')
    {
      return '<span class="meta phase">'+val.name+'</span>';
    }
    
    if (key=="phase_ex" && val!='null')
    {
      return '<span class="meta phase">'+val.name+'</span>';
    }

    if (key=="zoom")
    {
      return '<span class="meta zoom">'+val+'</span>';
    }

    if (key=="nicepath")
    {
      return '<span class="meta nicepath">'+val+'.mp4</span>';
    }

    if (key.lastIndexOf('gps', 0) === 0 || key=="media_type" || key=='role' || key=='shot' || key=='static_meta' || key=='timed_meta' || key=='coverage_class')
    {
      return "";
    }
    else
    {
      return '<span class="meta '+key+'"><strong>'+key + '</strong> ' + val + '</span>';
    }
  }

  $scope.runonce = false;

  $scope.mapfilter = {};
  $scope.rolefilter= [];
  $scope.topicfilter= [];
  $scope.contributorfilter= [];
  $scope.shotfilter=[];
  $scope.phasefilter=[];
  $scope.coveragefilter=[];
  $scope.hasvideo = false;
  $scope.isdeleted = false;

  $scope.users = [];

  $scope.setMapFilter = function(id)
  {
    $scope.mapfilter.id = id;
    delete $scope.mapfilter.created_by;
    $scope.tabs.tab0 = true;
    $scope.tabs.tab1 = false;
  }

  $scope.tabs = {
    tab0:true,
    tab1:false
  };

  $scope.clearFilters = function()
  {
    delete $scope.mapfilter.id;
    // delete $scope.mapfilter.created_by;
    $scope.rolefilter= [];
    $scope.shotfilter=[];
    $scope.phasefilter=[];
    $scope.coveragefilter=[];
    $scope.topicfilter= [];
    $scope.contributorfilter= [];
    $scope.slider.minValue = 0;
    $scope.slider.maxValue = 100;
    $scope.searchterm.$ = '';
    delete $scope.timefilterfrom;
    delete $scope.timefilterto;
    $scope.hasvideo = false;
    $scope.isdeleted = false;
  };

  $scope.mediaCount = function(id)
  {
    var count = _.filter($scope.media,function(m)
    {
      return m.created_by == id;
    }).length;
    return count;
  }


  $scope.map = { zoom: 8,center: { latitude: 45, longitude: -73 },bounds:{},
  events: {
        tilesloaded: function (map) {
            $scope.$apply(function () {
                $scope.mapInstance = map;
                if (!$scope.runonce)
                {
                  $scope.runonce = true;
                  $scope.fit();
                }
            });
        }
    } };

$scope.$watch('masterpix', function(newValue, oldValue) {
  _.each($scope.tracks,function(t){
    _.each(t.items,function(i){
       i.left = i.offset * $scope.masterpix;
    });
  });
});

 $scope.importtimeline = function()
  {
    if (!$scope.timelineimported && $scope.event && $scope.fullyloaded)
    {
      $scope.timelineimported = true;
      if ($scope.event.timeline)
       {
         var newtimeline = $scope.event.timeline;
         _.each($scope.event.timeline,function(t)
           {
             var newitems = [];
             _.each(t.items,function(i)
               {
                 var item = _.clone(_.find($scope.media,{id:i.id}));
                 item.offset = i.offset;
                 item.left = item.offset * $scope.masterpix;
                 newitems.push(item);
               });
               t.items = newitems;
           });
           
          $scope.tracks = newtimeline;
       }
    }
  }


$scope.updateFilters = function()
{
  $scope.contributors = _.unique(_.compact(_.map($scope.media,function(m){
    return m.user;
  })),
  function(u){
    return u.profile.displayName;
  });

  $scope.roles = _.unique(_.map($scope.media,function(m){
    return m.meta.role_ex.name;
  }));

  $scope.coverage = _.unique(_.map($scope.media,function(m){
    return m.meta.coverage_class_ex.name;
  }));

  $scope.phases = _.unique(_.map($scope.media,function(m){
      return m.meta.phase_ex.name;
  }));

  $scope.takenshots = _.unique(_.map($scope.media,function(m){
    return m.meta.shot_ex;
  }),function(u){
    return u.id;
  });

   $scope.takenmeta = _.unique(_.map($scope.media,function(m){
    return m.meta.meta;
  }));

  // $scope.tagsmeta = 

  // $scope.tagsmeta = _.unique(_.compact(_.flatten(_.map($scope.media,function(m){
  //   if (m.meta && m.meta.static_meta && m.meta.static_meta['-topics'])
  //     return m.meta.static_meta['-topics'].split(',');
  //   else
  //     return null;
  // }))));
};

var stopTime = -1;

$scope.tag=function(media,event)
{
  if (media.meta.static_meta.edit_tag==undefined)
  {
    media.meta.static_meta.edit_tag = new Date();
    socket.post('/media/add_tag', {id:media.id,field:'edit_tag',val:media.meta.static_meta.edit_tag},function(result){

    });
  }
  else {
    delete media.meta.static_meta.edit_tag;
    socket.post('/media/rm_tag', {id:media.id,field:'edit_tag'},function(result){

    });
  }

  if(event){
    event.stopPropagation();
    event.preventDefault();
  }
}

$scope.removeclip = function(media,event){

  var r = confirm("Do you really want to remove this media?");
    if (r == true) {
      delete media.path;
      delete media.thumb;
      socket.post('/media/remove', {id:media.id},function(result){
        //removed!

      });
    }
    //delete media.meta.static_meta.edit_tag;


  if(event){
    event.stopPropagation();
    event.preventDefault();
  }
}

$scope.fixMap = function()
{
   $timeout(function () {
    $scope.fit();
  },500);
}



$scope.fit = function()
{
  if ($scope.mapready)
  {
    // $scope.mapshown = false;
    var bounds = new google.maps.LatLngBounds();
    for (var i in $scope.media)
    {
      if ($scope.media[i].meta.static_meta.gps_lat)
        bounds.extend(new google.maps.LatLng($scope.media[i].meta.static_meta.gps_lat,$scope.media[i].meta.static_meta.gps_lng));
    }
    //$scope.map.bounds = bounds;
    //$scope.map.control.fitBounds(bounds);
    //$scope.circles[0].center = {longitude:bounds.getCenter().lng(),latitude:bounds.getCenter().lat()};
    // $scope.$apply;

    $scope.circles = [
      {
          id: 1,
          center: {
             longitude:bounds.getCenter().lng(),
             latitude:bounds.getCenter().lat()
          },
          radius: 250,
          stroke: {
              color: '#08B21F',
              weight: 2,
              opacity: 1
          },
          fill: {
              color: '#08B21F',
              opacity: 0.3
          },
          geodesic: true, // optional: defaults to false
          draggable: true, // optional: defaults to false
          clickable: false, // optional: defaults to true
          editable: true, // optional: defaults to false
          visible: true, // optional: defaults to true
          control: {},
          events:{
            center_changed:function(arg1)
            {
              $scope.circlefilter = arg1;
              $scope.log('circlefilter',{center:arg1.center,radius:arg1.radius});
            },
            radius_changed:function(arg1)
            {
              $scope.circlefilter = arg1;
              $scope.log('circlefilter',{center:arg1.center,radius:arg1.radius});
            }
          }
      }
  ];

    if ($scope.mapInstance)
    {
      google.maps.event.trigger($scope.mapobject, 'resize');
      //$scope.mapInstance.trigger(map, "resize");
      $scope.mapInstance.fitBounds(bounds);
      $scope.mapInstance.refresh = function(){return true; };
    }
  }
}
   
   //  04/08/2015 12:45:14.58 PM +01
   
   
  /* LIVE EDITING */
    
  $scope.shots = [];

  $scope.currentlive = {};
  
  $scope.editlist = [];
  
  angular.element($window).on('keydown', function(e) {
      if ($scope.editing)
      {
        var key = e.keyCode-49;
        var uu = _.sortBy(_.values($scope.users),'id');
        if (uu.length > parseInt(key))
          $scope.makeLive(uu[parseInt(key)]);
      }
  });
  
  $scope.calculateEdit = function(edit)
  {
    if (edit.media)
    {
      var createdat = moment(edit.media.meta.static_meta.captured_at+':00',"DD/MM/YYYY HH:mm:ss.SS A Z");
      //console.log(createdat.format());
      //console.log(edit.cutto.format());
      
      var inpoint = edit.cutto.valueOf() - createdat.valueOf();
      
      var outpoint = edit.cutfrom.valueOf() - createdat.valueOf(); 
      edit.outpoint = outpoint/1000;
      //console.log("calc: "+outpoint);
      //console.log("rough: "+edit.out_int);
      if (!isNaN(edit.in_int))
        edit.inpoint = inpoint/1000;
      else
        edit.inpoint = 0;
        
      //save the edit:
       var filtered = _.filter($scope.editlist,function(e)
       {
         return e.media && e.media.id == edit.media.id;
       });
         
       var edits = _.map(filtered,function(e)
         {
            return {
              inpoint:e.inpoint,
              outpoint:e.outpoint,
              madeby:masteruserid
            };
         });
         
       socket.post('/media/update_edits/', {id:edit.media.id,edits: edits}).then(function(){
         console.log("saved media "+edit.media.id);
       });
    } 
  }
  
  $scope.makeLive = function(user)
  {
    if (user.status=='live' && (!$scope.currentlive.user || ($scope.currentlive.user && user.id != $scope.currentlive.user.id)))
    {
    //do editing things here...
      if ($scope.currentlive.user)
      {
        //adjust outpoint of the last one...
        var e = _.last($scope.editlist);
        e.out_int = ($scope.calcTime($scope.currentlive.user) - user.warning - user.live);
        e.cutfrom = moment();
        e.length = e.cutfrom.valueOf() - e.cutto.valueOf();
        
        $scope.currentlive.user = user;
        
        var edit = {
          cutto:moment(),
          user_id:$scope.currentlive.user.id,
          image:$scope.shotMap($scope.currentlive.user),
          in_int:($scope.calcTime(user) - user.warning - user.live)
        };
        $scope.editlist.push(edit);
      }
      else
      {
        var edit = {
          cutto:moment(),
          user_id:user.id,
          image:$scope.shotMap(user),
          in_int:($scope.calcTime(user) - user.warning - user.live)
        };
        $scope.editlist.push(edit);
        $scope.currentlive.user = user;
      }
    }
  }
  
  $scope.coverageMap = function(c)
  {
    if ($scope.event && c)
      return $scope.event.coverage_classes[c].name;
    else return '';
  }
  
  $scope.calcTime = function(user)
  {
    if (!user)
      return 0;
    
    var magicnumber = user.warning + user.live + user.length;
    var myoffset = ($scope.timer - user.offset) % magicnumber;
    if (myoffset < 0) // fix circular timeline
		{
			myoffset+=magicnumber;
		}
    return myoffset;
  }
  
  $scope.latestshot = function(user)
  {
    var u = _.find($scope.media,function(m){
      return m.created_by == user.id;
    });
    return u;
  }
  
  $scope.shotMap = function(user)
  {
   if (user.shot)
      {
      var returns = _.find($scope.shots, function(s){
        return s.id == user.shot;
      });
          if ((user.shot==false && user.shot!=0) || !returns)
            return '/static/images/blank.png';
        return '/static/data/icons/'+returns.image;
      }
      else{
        return '/static/images/blank.png';
      }    
  };
  
    $scope.shotMapLarge = function(user)
    {
      
      if (!user)
        return '/static/images/blank.png';
      //console.log(user);
      if (user.shot)
      {
        var returns = _.find($scope.shots, function(s){
          return s.id == user.shot;
        }).image;
        if (user.shot==false && user.shot!=0)
           return '/static/images/blank.png';
        return '/static/data/images/'+returns;
      }
      else{
         return '/static/images/blank.png';
      }
    };


  $scope.loading = true;
  $scope.mapready = false;
  $scope.fullyloaded = false;

  $scope.mapobject = null;

  uiGmapIsReady.promise(1).then(function(instances) {
      instances.forEach(function(inst) {
        // console.log('map ready');
        $scope.mapobject = inst.map;
        $scope.mapready = true;
      });
  });
  $scope.timelineimported = false;

 

  $scope.changemetaphase = function(phaseid) {
    socket.post('/api/shoot/changephase/'+mastereventid, { phase: phaseid })
    .then(function (response) {
      location.reload();
    });
  }

  // (function () {
    //usSpinnerService.spin('spinner-1');

    // Using .success() and .error()
    socket.get('/event/updates/'+mastereventid)
      .success(function (data, status, headers, jwr) {
        //$scope.bars = data;
      })
      .error(function (data, status, headers, jwr) {

      });

      socket.get('/commission/templateinfo/'+mastereventid)
            .then(function(resp){
               $scope.event = resp.data;
               $scope.importtimeline();
            });

      $scope.slider = {
        minValue: 0,
        maxValue: 100,
        options: {
            floor: 0,
            ceil: 100,
            step: 1
        }
      };

      $scope.media = [];

      var start = 0;
      var limit = 50;
      var loading = false;

      if (typeof(editing) == 'undefined')
      {

      stopTime = $interval(function(){
        $scope.loading = true;
        // Using .then()
        if (!loading)
        {
          loading = true;
          socket.get('/media/nicejson/'+mastereventid + '?limit='+limit+'&skip='+(start*limit))
            .then(function(resp){
               $scope.media = $scope.media.concat(resp.data);
               $timeout(function(){
                 $scope.fit();
                },0,false);
               $scope.updateFilters();
               //usSpinnerService.stop('spinner-1');
               $scope.loading = false;
               start++;
               if (resp.data.length < limit)
               {
                 $interval.cancel(stopTime);
                 $scope.fullyloaded = true;
                 $scope.importtimeline();
               }

               loading = false;
            });
        }
      }, 200);
      } 

      socket.on('event',function(response)
      {
          if (response.data.shots != undefined)
          {
            $scope.shots = response.data.shots;
          }

          if (response.data.media != undefined)
          {
              //new media item from this event
              //render media:
              //add media to the front of the list...
              if (response.data.update)
              {
                //find the one that matches...
                for (var i=0;i<$scope.media.length;i++)
                {
                  if ($scope.media[i].id == response.data.media.id)
                  {
                    $scope.media[i] = response.data.media;
                  }
                }
                
                if ($scope.editing)
                {
                  var e = _.filter($scope.editlist,function(e){
                    return e.media && e.media.id == response.data.media.id;
                  });
                  _.each(e,function(f){
                    f.media.thumb = response.data.media.thumb;
                  })
                    
                }

                //update whole table...
                //$('#media').html(mediatemplate(media));
              }
              else
              {
                //single shot:
                $scope.media.unshift(response.data.media);           
                if ($scope.editing)
                {
                  //find theall things in the edit list with this user but no media set:
                  var edit = _.filter($scope.editlist,function(m){
                    return m.user_id==response.data.media.created_by && m.media==null;
                  });
                  _.each(edit,function(e){
                    e.media = response.data.media;
                    $scope.calculateEdit(e);
                  });                  
                }
              }

              $scope.updateFilters();
          }
          
          //add this to the log...
          if (response.data.timer != undefined)
          {
            $scope.timer = response.data.timer;
            timer = response.data.timer;
          }

          if (response.data.users != undefined)
          {         
            $scope.ucount = response.data.ucount;
            $scope.users = response.data.users;
            
            //console.log($scope.currentlive.status);
            if ($scope.editing)
            {
                if ($scope.currentlive.user)
                {
                  var tmplive = _.find($scope.users,{id:$scope.currentlive.user.id});
                  
                  if (tmplive.status!='live')
                  {
                    var personlive = _.find($scope.users,{status:'live'});
                    if (personlive)
                    {
                      $scope.makeLive(personlive);
                    }
                  }
                }
                else{
                  var personlive = _.find($scope.users,{status:'live'});
                    if (personlive)
                    {
                      $scope.makeLive(personlive);
                    }
                }
            }
          }

          if (response.data.phase != undefined)
          {
            $scope.mode = response.data.phase;
            $scope.phase = response.data.ruleset;
          }
      });
  // }());
}]);
