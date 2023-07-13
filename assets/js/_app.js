"use strict";

var bootleggerApp = angular.module("bootleggerApp", [
  "ngSanitize",
  "ngLoadingSpinner",
  "ngSails",
  "ui.slider",
  "ui.bootstrap",
  "ui.inflector",
  "ui.format",
  "ui.sortable",
  "ui.knob",
  "ngAnimate",
  "checklist-model",
  "frapontillo.bootstrap-switch",
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "ngLoadingSpinner",
  "ngStorage",
  "ui.grid",
  "ui.grid.pagination",
  "ui.grid.moveColumns",
  "ui.grid.resizeColumns",
  "angularUtils.directives.dirPagination",
  "ui.slider",
  "ngDragDrop",
  "rzModule",
  "angularTokenfield",
  "colorpicker.module",
]);

bootleggerApp.service("$bootleggerSails", [
  "$sails",
  function ($sails) {
    this.get = function (url) {
      if (url.indexOf("?") != -1) url += "&apikey=" + apikey;
      else url += "?apikey=" + apikey;

      // url = url.replace('/api/', '/api/' + api + '/');

      return $sails.get(url);
    };

    (this.post = function (url, data) {
      // url = url.replace('/api/', '/api/' + api + '/');

      if (!data) data = {};
      data.apikey = apikey;
      return $sails.post(url, data);
    }),
      (this.on = $sails.on);
  },
]);

bootleggerApp.controller("myprofile", [
  "$scope",
  "$bootleggerSails",
  function ($scope, socket) {
    $scope.loading = true;

    // (function () {

    //   socket.get('/event/myeventsowned')
    //     .then(function (resp) {
    //       $scope.myevents = _.filter(resp.data, function (e) {
    //         if (!e.status) {
    //           var tmp = [];
    //           tmp = _.filter(e.events, function (f) {
    //             return f.status == 'OWNER';
    //           });
    //           e.events = tmp;
    //           return e.events.length > 0;
    //         }
    //         else {
    //           return e.status == 'OWNER';
    //         }
    //       });
    //       $scope.loading = false;
    //     });
    // })();
  },
]);

bootleggerApp.controller("adminlists", [
  "$scope",
  "$bootleggerSails",
  function ($scope, socket) {
    $scope.shoots = [];
    $scope.shootsearch = null;
    $scope.settings = {
      processedits: false,
    };

    $scope.searchEvent = function ($item, $model, $label) {
      //console.log($item);
      window.location = "/shoot/" + $item.id;
      //do something
    };

    $scope.getShoot = function (val) {
      return socket
        .post("/event/search", { term: val })
        .then(function (response) {
          return response.data;
        });
    };

    (function () {
      socket.get("/watch/queuelength").then(function (resp) {
        $scope.edits = resp.data;
      });

      socket
        .get("/api/settings")
        .then(function (resp) {
          setTimeout(function () {
            $scope.settings.processedits =
              resp.data.processedits == "true" ? true : false;
          }, 1);
          // $scope.$apply();
        })
        .catch(function (err) {
          console.log(err);
        });
    })();
    // }]);

    // bootleggerApp.controller('settings', ['$scope', '$bootleggerSails', function ($scope, socket) {

    $scope.updateSetting = function () {
      // console.log($scope.settings);

      socket
        .post(
          "/api/settings/update/processedits/" + $scope.settings.processedits
        )
        .then(function (resp) {})
        .catch(function (err) {
          console.log(err);
        });
    };

    // (function () {
    //   socket.get('/api/settings')
    //     .then(function (resp) {
    //       $scope.settings = resp.data;
    //     })
    //     .catch(function(err){
    //       console.log(err);

    //     });
    // })();
  },
]);

// var eventlisttemplate;
$(function () {
  // $("#chromecast").popover({
  //   html: true,
  //   content: $('#cast_content')
  // });

  $(".fileinput").on("change.bs.fileinput", function (e, o) {
    var form = $(this).closest("form");
    form.submit();
  });

  // $('[data-toggle="tooltip"]').tooltip();
  // $('[data-toggle="popover"]').popover();

  //fire any other init functions:

  // if (typeof (bootlegger_init) != 'undefined') {
  // bootlegger_init();
  // }
});

function showok(msg, obj) {
  $(obj).tooltip({
    title: msg,
    trigger: "manual",
  });

  $(obj).tooltip("show");
  setTimeout(function () {
    $(obj).tooltip("hide");
    $(obj).tooltip("destroy");
  }, 2000);
}

bootleggerApp.controller("titleController", [
  "$scope",
  "$bootleggerSails",
  function ($scope, socket) {
    $scope.editingtitle = false;

    $scope.titlechanged = function ($event) {
      if ($event.keyCode == 13) {
        var regex = /(<([^>]+)>)/gi;
        var newval = $("#titleedit").val().replace(regex, "");
        //console.log(newval);
        if (newval.length > 4) {
          $scope.editingtitle = false;
          // $('.thetitle').replaceWith(oldtitle);
          $(".thetitle span").text(newval);
          socket
            .post("/event/changetitle/" + mastereventid, { title: newval })
            .then(function (response) {
              showok("Title Updated", $(".thetitle"));
            });
        }
      }
    };

    $scope.edittitle = function () {
      if (!$scope.editingtitle) {
        $scope.editingtitle = true;
        $("#titleedit").focus();
        //var w = $('#title span').width() + 150;
        //console.log(w);
        // oldtitle = $('.thetitle');
        // $('.thetitle').replaceWith('');
      }
    };
  },
]);
