"use strict";

var shuffleArray = function (array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

bootleggerApp.filter("isMine", function () {
  return function (items, params) {
    var filtered = [];
    // If time is with the range
    angular.forEach(items, function (item) {
      if (
        (typeof params.created_by != "undefined" &&
          item.created_by == params.created_by) ||
        typeof params.created_by == "undefined"
      )
        filtered.push(item);
    });
    return filtered;
  };
});

bootleggerApp.controller("list", [
  "$scope",
  "$http",
  "$sce",
  "$localStorage",
  "$timeout",
  "$interval",
  "$bootleggerSails",
  function ($scope, $http, $sce, $storage, $timeout, $interval, socket) {
    $scope.sources = [];
    $scope.playlist = [];
    $scope.loading = true;

    $scope.edit = { title: "", description: "" };

    $scope.getMediaThumb = function (media) {
      //update to find first actual media file:
      var found = false;
      i = 0;
      while (!found) {
        if (media[i].thumb) found = media[i].id;
        i++;
      }
      return found;
    };

    // $scope.restartedit = function (id, event) {
    //   socket.post('/watch/restartedit/' + id).then(function (resp) {
    //     //done
    //   });

    //   if (event) {
    //     event.stopPropagation();
    //     event.preventDefault();
    //   }
    // };

    $scope.formatDate = function (date) {
      var dateOut = moment(date, "DD-MM-YYYY");
      return dateOut.toDate();
    };

    (function () {
      //usSpinnerService.spin('spinner-1');

      // try {
      //   // addthis.init();
      // } catch (e) {
      //   console.log("AddThis not defined in localmode");
      // }

      socket.on("edits", function (resp) {
        // console.log(resp);
        //update the progress...
        for (var i = 0; i < $scope.edits.length; i++) {
          if ($scope.edits[i].id == resp.data.edit.id) {
            $scope.edits[i] = resp.data.edit;
          }
        }
      });

      // Using .success() and .error()
      socket.get("/watch/mymedia/").then(function (resp) {
        $scope.edits = resp.data.edits;

        console.log("subscribing");
        socket
          .post("/api/watch/editupdates", {
            edits: _.pluck($scope.edits, "id"),
          })
          .then(function (resp) {
            console.log(resp);
          });

        // $timeout(function () {
        //   // addthis.toolbox('.addthis_toolbox');
        // }, 0);

        // $scope.shoots = resp.data.shoots;
        // $scope.owned = resp.data.owned;
        $scope.loading = false;
      });
    })();
  },
]);

bootleggerApp.controller("edits", [
  "$scope",
  "$http",
  "$sce",
  "$localStorage",
  "$timeout",
  "$interval",
  "$bootleggerSails",
  function ($scope, $http, $sce, $storage, $timeout, $interval, socket) {
    $scope.sources = [];
    $scope.playlist = [];
    $scope.loading = true;

    $scope.edit = { title: "", description: "" };
    // console.log("loading");

    $scope.restartedit = function (id, event) {
      socket.post("/watch/restartedit/" + id).then(function (resp) {
        //done
      });

      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
    };

    $scope.getMediaThumb = function (media) {
      //update to find first actual media file:
      var found = false;
      var i = 0;
      while (!found) {
        if (media[i].thumb) found = media[i].id;
        i++;
      }
      return found;
    };

    $scope.formatDate = function (date) {
      var dateOut = moment(date, "DD-MM-YYYY");
      return dateOut.toDate();
    };

    $scope.hasTranscription = function (edit) {
      let hasTrans = false;

      if (edit.transcription) {
        hasTrans = _.every(edit.transcription.chunks, function (c) {
          return typeof c.review != "undefined";
        });
      }
      return hasTrans;
      // console.log(edit);
      // return true;
    };

    $scope.updateSetting = function () {
      // console.log('updating setting')
      socket
        .post("/api/event/edit/" + mastereventid, {
          processedits: $scope.event.processedits,
        })
        .then(function (response) {
          //done!
          // console.log(response);
        });
    };

    (function () {
      socket.on("edits", function (resp) {
        // console.log(resp);
        //update the progress...
        for (var i = 0; i < $scope.edits.length; i++) {
          if ($scope.edits[i].id == resp.data.edit.id) {
            // console.log($scope.edits[i]);
            $scope.edits[i].progress = resp.data.edit.progress;
            $scope.edits[i].fail = resp.data.edit.fail;
            $scope.edits[i].failed = resp.data.edit.failed;
          }
        }
      });

      $scope.getClipLength = function (point) {
        // if (media.inpoint) {
        var lena = point.split(":");
        var time =
          parseInt(lena[0]) * 3600 +
          parseInt(lena[1]) * 60 +
          parseFloat(lena[2]);
        return time * 1000;
      };

      $scope.medialength = function (media) {
        //aggregate media length:
        var total = 0;
        _.each(media, function (m) {
          // console.log(m);

          total +=
            $scope.getClipLength(m.outpoint) - $scope.getClipLength(m.inpoint);
        });

        return msToTimeS(total);
      };

      socket
        .get("/commission/templateinfo/" + mastereventid)
        .then(function (resp) {
          $scope.event = resp.data;
        });

      socket.get("/event/contributors/" + mastereventid).then(function (resp) {
        $scope.groups = _.uniq(
          _.map(resp.data, function (e) {
            return e.profile.displayName;
          })
        );
      });

      // Using .success() and .error()
      socket.get("/watch/alledits/" + mastereventid).then(function (resp) {
        $scope.edits = resp.data;

        // console.log("subscribing");
        socket
          .post("/api/watch/editupdates", {
            edits: _.pluck($scope.edits, "id"),
          })
          .then(function (resp) {
            // console.log(resp);
          });

        $timeout(function () {
          $(".dropdown-submenu a.reassign").on("click", function (e) {
            $(this).next("ul").toggle();
            e.stopPropagation();
            e.preventDefault();
          });
        }, 0);

        $scope.loading = false;
      });
    })();
  },
]);

function msToTime(s) {
  function addZ(n) {
    return (n < 10 ? "0" : "") + n;
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return addZ(hrs) + ":" + addZ(mins) + ":" + addZ(secs) + "." + ms;
}

function msToTimeS(s) {
  function addZ(n) {
    return (n < 10 ? "0" : "") + n;
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return addZ(mins) + ":" + addZ(secs);
}
