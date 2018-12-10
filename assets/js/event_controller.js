bootleggerApp.controller('event', ['$scope', '$bootleggerSails', '$timeout', '$sce', 'usSpinnerService', '$interval', '$filter', '$rootScope', '$http', function ($scope, socket, $timeout, $sce, usSpinnerService, $interval, $filter, $rootScope, $http) {
  $scope.permissions = {
    value : 3,
    options:{
      floor:0,
      ceil:3,
      showTicks:true,
      hideLimitLabels:true,
      hidePointerLabels: true
    }
  };

  ($(function(){
   
    $(document).on('change', '.btn-file :file', function () {
      var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [numFiles, label]);
    });

    $(document).ready(function () {
      $('.btn-file :file').on('fileselect', function (event, numFiles, label) {

        var input = $(this).parents('.input-group').find(':text'),
          log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
          input.val(log);
        } else {
          if (log) alert(log);
        }

      });

    });

    

    var initializing = true;
    $scope.$watch('event.description',function(){
      if (!initializing)
      {
        $scope.dirty = true;
      }
    });

    $scope.$watch('permissions.value', function() {
      if ($scope.event)
      {
      switch ($scope.permissions.value)
      {
        case 0:
          $scope.event.publicview = false;
          $scope.event.public = false;
          $scope.event.publicshare = false;
          $scope.event.publicedit = false;
        break;
        case 1:
          $scope.event.publicview = true;
          $scope.event.public = false;
          $scope.event.publicshare = false;
          $scope.event.publicedit = true;
          break;
        case 2:
          $scope.event.publicview = true;
          $scope.event.public = true;
          $scope.event.publicshare = false;
          $scope.event.publicedit = false;
          break;
        case 3:
          $scope.event.publicview = true;
          $scope.event.public = true;
          $scope.event.publicshare = true;
          $scope.event.publicedit = true;
      }
      //update event:
      $scope.startupdate();
      socket.post('/api/event/edit/'+mastereventid, { 
        public: $scope.event.public,
        publicview: $scope.event.publicview,
        publicedit: $scope.event.publicedit,
        publicshare: $scope.event.publicshare
       }).then(function (response) {
        $scope.stopupdate();
        showok('Updated permissions', $('#publicevent'));
      });
    }
    });

      $('#roleimg').one("load", function () {
        var imgwidth = $('#roleimg').width();
        var imgheight = $('#roleimg').height();

        $('.draggable').each(function (e) {
          $(this).css('position', 'absolute');
          $(this).css('left', $(this).data('x') * imgwidth);
          $(this).css('top', $(this).data('y') * imgheight);
        });

        $(".draggable").draggable({
          containment: "parent",
          scroll: false,
          cursor: "move",
          stop: function (ev, ui) {
            //dragging stopped -- calculate and update:
            var token = $(ui.helper[0]);
            $scope.startupdate();
            // console.log($(ui.helper[0]).data('role'));
            socket.post('/event/updaterole/'+mastereventid, { role: $(ui.helper[0]).data('role'), x: ui.position.left / imgwidth, y: ui.position.top / imgheight }).then(function (response) {
              $scope.stopupdate();
              showok('Position Updated', $('#roleimg'));
            });


            //$('#roleimg').width
          }
        });
      }).each(function () {
        if (this.complete) $(this).load();
      });

      socket.get('/api/event/codes/'+mastereventid).then(function (response) {
        $scope.codes = response.data.codes;
      });

      socket.get('/api/event/admins/'+mastereventid).then(function (response) {
        $scope.admins = response.data;
      });

      socket.get('/commission/templateinfo/'+mastereventid)
      .then(function(resp){
         $scope.event = resp.data;
        if ($scope.event.public == false && $scope.event.publicview == false && $scope.event.publicshare == false  && $scope.event.publicedit == false)
          $scope.permissions.value = 0;

          if ($scope.event.public == false && $scope.event.publicview == true && $scope.event.publicshare == false  && $scope.event.publicedit == true)
          $scope.permissions.value = 1;

          if ($scope.event.public == true && $scope.event.publicview == true && $scope.event.publicshare == false  && $scope.event.publicedit == false)
          $scope.permissions.value = 2;

          if ($scope.event.public == true && $scope.event.publicview == true && $scope.event.publicshare == true  && $scope.event.publicedit == true)
          $scope.permissions.value = 3;

          $scope.loading = false;
          
          $timeout(function() { initializing = false; });
      });
      
    }));

    $scope.showmsg = false;
    $scope.loading = true;


      // $(".make-switch").bootstrapSwitch();

      $('[name=starts]').datepicker().on('changeDate', function (ev) {
        $(this).datepicker('hide');
        $scope.updatestart(ev.date);
      });

      $('[name=ends]').datepicker().on('changeDate', function (ev) {
        $(this).datepicker('hide');
        $scope.updateend(ev.date);
      });

       
    
    $scope.startupdate = function() {
      // $('.updated i').show();
      $scope.showmsg = true;
    }

    $scope.stopupdate = function() {
      // $('.updated i').hide();
      $scope.showmsg = false;
      $scope.dirty = false;
      $scope.event.updatedAt = new Date();
    }

    $scope.addcode = function() {
      $scope.startupdate();
      if ($('#number').val() != '' || $('#email').val() != '') {
        socket.post('/api/event/addcode/', { id: mastereventid, number: $('#number').val(), email: $('#email').val() }).then(function (response) {

          socket.get('/api/event/codes/'+mastereventid).then(function (response) {
            $scope.stopupdate();
            //console.log(response);
            $scope.codes = response.data.codes;
            showok('Code Sent', $('#eventcodes'));
            // $('#eventcodes').html(codestemplate(response));
            // $('[data-toggle="tooltip"]').tooltip();
          });
        });
      }
    }

    $scope.resendcode = function(code) {
      $scope.startupdate();
      socket.post('/api/event/resendcode/', { id: mastereventid, code: code }).then(function (response) {

        socket.get('/api/event/codes/'+mastereventid).then(function (response) {
          //console.log(response);
          $scope.stopupdate();
          $scope.codes = response.data.codes;
          showok('Code Resent', $('#eventcodes'));
          // $('#eventcodes').html(codestemplate(response));
          // $('[data-toggle="tooltip"]').tooltip();
        });
      })
      .catch(function(err){
        console.log(err);
      });
    }

    $scope.removeadmin = function(user) {
      $scope.startupdate();
      socket.post('/api/event/removeadmin/', { id: mastereventid, userid: user }).then(function (response) {

        socket.get('/api/event/admins/'+mastereventid).then(function (response) {
          //console.log(response);
          $scope.stopupdate();
          // $('#admins').html(adminstemplate(response));
          $scope.admins = response.data;
          showok('Admin Removed', $('#eventadmins'));
          // $('[data-toggle="tooltip"]').tooltip();
        });
      });
    }

    $scope.remcode = function(code) {
      $scope.startupdate();
      socket.post('/api/event/remcode/', { id: mastereventid, code: code })
      .then(function (response) {

        socket.get('/api/event/codes/'+mastereventid).then(function (response) {
          //console.log(response);

          $scope.stopupdate();
          //$('#eventcodes').html(codestemplate(response));
          $scope.codes = response.data.codes;
          showok('Code removed', $('#eventcodes'));

          // $('[data-toggle="tooltip"]').tooltip();
        });
      })
      .catch(function(err){
        console.log(err);
      });
    }


    $scope.addadmin = function() {

      if ($('#admina').val() != '') {
        $scope.startupdate();
        socket.post('/api/event/addadmin/', { id: mastereventid, email: $('#admina').val() })
        .then(function (response) {
          showok(response.msg, $('#admins'));
          socket.get('/api/event/admins/'+mastereventid).then(function (response) {
            $scope.stopupdate();
            $scope.admins = response.data;
            showok('Admin Added', $('#eventadmins'));
          });
        })
        .catch(function(resp){
          showok('Cannot add admin!', $('#eventadmins'));
          console.log(resp);
        });
      }
    }

    $scope.updatestart = function(d) {
      $scope.startupdate();
      var td = moment(d).format("DD-MM-YYYY");
      socket.post('/api/event/edit/'+mastereventid, { starts: td }).then(function (response) {
        $scope.stopupdate();
        showok('Event Start Date Updated', $('[name=starts]'));
      }).catch(function(err){
          console.log(err);
      });
    }

    $scope.updateend = function(d) {
      $scope.startupdate();
      var td = moment(d).format("DD-MM-YYYY");
      socket.post('/api/event/edit/'+mastereventid, { ends: td }).then(function (response) {
        $scope.stopupdate();
        showok('Event End Date Updated', $('[name=ends]'));
      });
    }

    $scope.validateTime = function(time) {
      var re = /\d{1,2}([apAP][mM]){1}/;
      return re.test(time) && time.length < 5 && time.length > 2;
    }

    $scope.updatestarttime = function() {
      if (validateTime($('[name=starts_time]').val())) {
        $scope.startupdate();
        socket.post('/api/event/edit/'+mastereventid, { starts_time: $('[name=starts_time]').val() }).then(function (response) {
          $scope.stopupdate();
          showok('Event Start Time Updated', $('[name=starts_time]'));
        });
      }
      else {
        showok('Invalid Time Entered', $('[name=starts_time]'));
      }
    }

    $scope.updateendtime = function() {
      if (validateTime($('[name=ends_time]').val())) {
        $scope.startupdate();
        socket.post('/api/event/edit/'+mastereventid, { ends_time: $('[name=ends_time]').val() }).then(function (response) {
          $scope.stopupdate();
          showok('Event End Time Updated', $('[name=ends_time]'));
        });
      }
      else {
        showok('Invalid Time Entered', $('[name=ends_time]'));
      }
    }

    $scope.dirty = false;

    $scope.updaterelease = function() {
      $scope.startupdate();
      socket.post('/api/event/edit/'+mastereventid, { 
        release: $('#editor2').cleanHtml(), 
        shotrelease:$('#editor').cleanHtml(),
        description:$scope.event.description
      }).then(function (response) {
        // $('.dirty').hide();
        $scope.stopupdate();
        showok('Updated Releases', $('#releaseupdatebtn'));
      });
    }

      $('#editor').wysiwyg().on('change', function () {
        $scope.$apply(function(){
          $scope.dirty = true;
        });
        // $('.dirty').show();
      });
      $('#editor2').wysiwyg().on('change', function () {
        // $('.dirty').show();
        $scope.$apply(function(){
          $scope.dirty = true;
        });
      });

    $scope.notour = function() {
      localStorage["firstrunview"] = true;
    }

    $scope.tour = function() {
      $('#myModal').modal('hide');
      localStorage["firstrunview"] = true;
      bootstro.start('.bootstro', { stopOnBackdropClick: false });
    }

  }]);