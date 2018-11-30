'use strict';

bootleggerApp.controller('export',['$scope','$bootleggerSails','$timeout','$sce','usSpinnerService','$interval','$filter','$rootScope','$http', function ($scope,socket,$timeout,$sce,usSpinnerService,$interval,$filter,$rootScope,$http) {

  $scope.loading = 0;

  $scope.outputs = [];
  $scope.mytemplates = [];
  $scope.editing = {};

  $scope.addoutput = function()
  {
    $scope.outputs = angular.copy($scope.alloutputs);

    var nn = {title:'New Output '+ new Date().toString(),outputs:[]};
    $scope.mytemplates.push(nn);

    $scope.editing.current = nn;
  }

  $scope.edit = function(mm)
  {
    $scope.outputs = angular.copy($scope.alloutputs);
      $scope.editing.current = mm;
  }

  $scope.clientfailed =  false;
  $scope.clientconnected = false;

  $scope.localconnect = function()
  {
    $scope.save();
    var image = new Image(1,1);
    image.onerror = function() { 
      alert('Have you downloaded and started the local client?');
      $scope.clientfailed=true;
      $scope.clientconnected=false;
       };
    image.onload = function() { 
      //alert('Connected!');
      $scope.clientfailed=false;
      $scope.clientconnected=true;
       };
    var d = new Date();
    image.src = "http://localhost:8664/signin/?session="+sessionkey+"&eventid="+mastereventid+"&template="+$scope.mytemplates.indexOf($scope.editing.current)+"&"+d.getTime()+"&hostname="+window.location.hostname + "&port="+window.location.protocol;
  }

$scope.options = {
  homog:0
};

  $scope.doit = function()
{
  $http.post('/post/downloadall/'+mastereventid+'?apikey='+apikey,{homog:$scope.options.homog,template:$scope.mytemplates.indexOf($scope.editing.current),from:$('#from').val(),to:$('#to').val()}).then(function(resp)
  {
    $scope.downloadprogress = resp.data;
  });
}

$scope.cancel = function()
{
  $.get('/post/canceldownload/'+mastereventid+'?apikey='+apikey).then(function(data)
  {
    $scope.downloadprogress = {};
  });
}

$scope.downloadprogress = {percentage:0};

$scope.remove = function(output){
  $scope.mytemplates.splice($scope.mytemplates.indexOf(output),1);
}

$scope.getprogress = function()
{
  socket.get('/post/downloadprogress/'+ mastereventid).then(function(resp)
  {
      $scope.downloadprogress = resp.data;
  });
}

  $scope.getedl = function()
  {
    $scope.save(function(){
      window.location = "/post/module_function/audio_sync?func=getedl&event="+mastereventid+"&template="+$scope.mytemplates.indexOf($scope.editing.current)+'&apikey='+apikey;
    });
     //href="/post/module_function/audio_sync?func=getedl&event=<%-event.id %>&template={{mytemplates.indexOf(editing.current)}}"
  }

  $scope.save = function(cb)
  {
    _.each($scope.mytemplates,function(r)
    {
      delete r['$$hashKey'];
      _.each(r.outputs,function(rr)
      {
        delete rr['$$hashKey'];
      });
    });
    socket.post('/post/updateoutputs/',{outputtemplates:$scope.mytemplates})
      .then(function(resp){
        $scope.success = true;
        if (cb)
          cb();
         setTimeout(function(){
          delete $scope.success;
        },2000);
      });
  };

  (function () {
    //usSpinnerService.spin('spinner-1');

    // Using .success() and .error()
    socket.get('/media/availableoutputs/'+mastereventid)
      .then(function(resp){
         $scope.alloutputs = resp.data;
         $scope.loading++;;
      });

    socket.get('/api/post/myoutputtemplates/')
      .then(function(resp){
         $scope.mytemplates = resp.data.outputtemplates;

         $scope.loading++;
      });

      $scope.nums = {};
    socket.get('/post/getnumbers/'+mastereventid).then(function(resp)
    {
      $scope.nums = resp.data;
      $scope.loading++;
      setInterval($scope.getprogress,1000);
    });
  })();
}]);
