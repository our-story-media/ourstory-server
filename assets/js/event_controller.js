bootleggerApp.controller('event', ['$scope', '$bootleggerSails', '$timeout', '$sce', 'usSpinnerService', '$interval', '$filter', '$rootScope', '$http', function ($scope, socket, $timeout, $sce, usSpinnerService, $interval, $filter, $rootScope, $http) {

  $scope.ifRoleImages = function () {
    if ($scope.event) {
      return $scope.event.eventtype.roles.every(function (e) {
        return e.image;
      });
    }
    else
      return false;
  }

  $scope.permissions = {
    value: 0,
    options: {
      floor: 0,
      ceil: 3,
      showTicks: true,
      hideLimitLabels: true,
      hidePointerLabels: true
    }
  };

  ($(function () {

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
    $scope.$watch('event.description', function () {
      if (!initializing) {
        $scope.dirty = true;
      }
    });

    $scope.$watch('permissions.value', function () {
      if ($scope.event) {
        switch ($scope.permissions.value) {
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
        socket.post('/api/event/edit/' + mastereventid, {
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

    // $('#roleimg').one("load", function () {
    //   var imgwidth = $('#roleimg').width();
    //   var imgheight = $('#roleimg').height();

    //   $('.draggable').each(function (e) {
    //     $(this).css('position', 'absolute');
    //     $(this).css('left', $(this).data('x') * imgwidth);
    //     $(this).css('top', $(this).data('y') * imgheight);
    //   });

    //   $(".draggable").draggable({
    //     containment: "parent",
    //     scroll: false,
    //     cursor: "move",
    //     stop: function (ev, ui) {
    //       //dragging stopped -- calculate and update:
    //       var token = $(ui.helper[0]);
    //       $scope.startupdate();
    //       // console.log($(ui.helper[0]).data('role'));
    //       socket.post('/event/updaterole/' + mastereventid, { role: $(ui.helper[0]).data('role'), x: ui.position.left / imgwidth, y: ui.position.top / imgheight }).then(function (response) {
    //         $scope.stopupdate();
    //         showok('Position Updated', $('#roleimg'));
    //       });


    //       //$('#roleimg').width
    //     }
    //   });
    // }).each(function () {
    //   if (this.complete) $(this).load();
    // });

    socket.get('/api/event/codes/' + mastereventid).then(function (response) {
      $scope.codes = response.data.codes;
    });

    socket.get('/api/event/admins/' + mastereventid).then(function (response) {
      $scope.admins = response.data;
    });

    socket.get('/commission/templateinfo/' + mastereventid)
      .then(function (resp) {
        $scope.event = resp.data;
        if ($scope.event.public == false && $scope.event.publicview == false && $scope.event.publicshare == false && $scope.event.publicedit == false)
          $scope.permissions.value = 0;

        if ($scope.event.public == false && $scope.event.publicview == true && $scope.event.publicshare == false && $scope.event.publicedit == true)
          $scope.permissions.value = 1;

        if ($scope.event.public == true && $scope.event.publicview == true && $scope.event.publicshare == false && $scope.event.publicedit == false)
          $scope.permissions.value = 2;

        if ($scope.event.public == true && $scope.event.publicview == true && $scope.event.publicshare == true && $scope.event.publicedit == true)
          $scope.permissions.value = 3;

        $scope.loading = false;


        $scope.topiclangs = $scope.getlangs();

        if ($scope.topiclangs.length == 0)
          $scope.topiclangs.push({ name: 'en' });

        if (typeof ($scope.event.topics) == 'undefined')
          $scope.event.topics = [];


        $timeout(function () { initializing = false; });
      });

  }));

  $scope.showmsg = false;
  $scope.loading = true;
  $scope.topicsdirty = false;


  // $(".make-switch").bootstrapSwitch();

  $('[name=starts]').datepicker().on('changeDate', function (ev) {
    $(this).datepicker('hide');
    $scope.updatestart(ev.date);
  });

  $('[name=ends]').datepicker().on('changeDate', function (ev) {
    $(this).datepicker('hide');
    $scope.updateend(ev.date);
  });

  var initializingx = true;
  var initializingy = true;


  $scope.$watch('event.defaulttopiclang', function (newv, oldv) {
    if (initializingy) {
      $timeout(function () { initializingy = false; });
    } else {
      // do whatever you were going to do
      if (oldv)
        $scope.topicsdirty = true;
    }
  }, true);

  $scope.$watch('event.topics', function (newv, oldv) {
    if (initializingx) {
      $timeout(function () { initializingx = false; });
    } else {
      // do whatever you were going to do
      if (oldv)
        $scope.topicsdirty = true;
    }
  }, true);

  $scope.updatetopics = function () {
    var data = JSON.parse(angular.toJson($scope.event.topics))
    $scope.loading = true;
    socket.post('/api/event/edit/' + mastereventid, {
      topics: data,
      defaulttopiclang: $scope.event.defaulttopiclang
    }).then(function (response) {
      $scope.loading = false;
      $scope.topicsdirty = false;
      $scope.event.updatedAt = new Date();
    }).catch(function (err) {
      console.log(err);

    });
  }

  $scope.rmtopic = function (id) {

    _.remove($scope.event.topics, {
      id: id
    });
  }

  $scope.addtopic = function () {
    var newid = _.max(_.map($scope.event.topics, 'id')) + 1;
    if (!isFinite(newid))
      newid = 1;
    var newtopic = {
      id: newid,
      color: '#000000',
      values: {}
    };

    _.each($scope.topiclangs, function (t) {
      newtopic.values[t.name] = "";
    });

    $scope.event.topics.push(newtopic);
  }


  $scope.addlang = function () {
    if (!_.includes($scope.topiclangs, { name: 'new' })) {
      _.each($scope.event.topics, function (topic) {
        topic.values['new'] = "";
      });

      $scope.topiclangs.push({ name: 'new' });
    }
  }

  $scope.langchange = function (oldcode, code) {
    _.each($scope.event.topics, function (topic) {

      var tmp = topic.values[oldcode];
      delete topic.values[oldcode];
      topic.values[code] = tmp;
    });
  }

  $scope.getlangs = function () {
    // var items = _.pick($scope.event.topics,'values');
    var keys = _.map($scope.event.topics, function (i) {
      return _.keys(i.values);
    });

    return _.map(_.uniq(_.flatten(keys)), function (v) {
      return { name: v };
    });
  }

  $scope.startupdate = function () {
    // $('.updated i').show();
    $scope.showmsg = true;
  }

  $scope.stopupdate = function () {
    // $('.updated i').hide();
    $scope.showmsg = false;
    $scope.dirty = false;
    $scope.event.updatedAt = new Date();
    // $scope.dirtytopics = false;
  }

  $scope.addcode = function () {
    $scope.startupdate();
    if ($('#number').val() != '' || $('#email').val() != '') {
      socket.post('/api/event/addcode/', { id: mastereventid, number: $('#number').val(), email: $('#email').val() }).then(function (response) {

        socket.get('/api/event/codes/' + mastereventid).then(function (response) {
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

  $scope.resendcode = function (code) {
    $scope.startupdate();
    socket.post('/api/event/resendcode/', { id: mastereventid, code: code }).then(function (response) {

      socket.get('/api/event/codes/' + mastereventid).then(function (response) {
        //console.log(response);
        $scope.stopupdate();
        $scope.codes = response.data.codes;
        showok('Code Resent', $('#eventcodes'));
        // $('#eventcodes').html(codestemplate(response));
        // $('[data-toggle="tooltip"]').tooltip();
      });
    })
      .catch(function (err) {
        console.log(err);
      });
  }

  $scope.removeadmin = function (user) {
    $scope.startupdate();
    socket.post('/api/event/removeadmin/', { id: mastereventid, userid: user }).then(function (response) {

      socket.get('/api/event/admins/' + mastereventid).then(function (response) {
        //console.log(response);
        $scope.stopupdate();
        // $('#admins').html(adminstemplate(response));
        $scope.admins = response.data;
        showok('Admin Removed', $('#eventadmins'));
        // $('[data-toggle="tooltip"]').tooltip();
      });
    });
  }

  $scope.remcode = function (code) {
    $scope.startupdate();
    socket.post('/api/event/remcode/', { id: mastereventid, code: code })
      .then(function (response) {

        socket.get('/api/event/codes/' + mastereventid).then(function (response) {
          //console.log(response);

          $scope.stopupdate();
          //$('#eventcodes').html(codestemplate(response));
          $scope.codes = response.data.codes;
          showok('Code removed', $('#eventcodes'));

          // $('[data-toggle="tooltip"]').tooltip();
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }


  $scope.addadmin = function () {

    if ($('#admina').val() != '') {
      $scope.startupdate();
      socket.post('/api/event/addadmin/', { id: mastereventid, email: $('#admina').val() })
        .then(function (response) {
          showok(response.msg, $('#admins'));
          socket.get('/api/event/admins/' + mastereventid).then(function (response) {
            $scope.stopupdate();
            $scope.admins = response.data;
            showok('Admin Added', $('#eventadmins'));
          });
        })
        .catch(function (resp) {
          showok('Cannot add admin!', $('#eventadmins'));
          console.log(resp);
        });
    }
  }

  $scope.updatestart = function (d) {
    $scope.startupdate();
    var td = moment(d).format("DD-MM-YYYY");
    socket.post('/api/event/edit/' + mastereventid, { starts: td }).then(function (response) {
      $scope.stopupdate();
      showok('Event Start Date Updated', $('[name=starts]'));
    }).catch(function (err) {
      console.log(err);
    });
  }

  $scope.updateend = function (d) {
    $scope.startupdate();
    var td = moment(d).format("DD-MM-YYYY");
    socket.post('/api/event/edit/' + mastereventid, { ends: td }).then(function (response) {
      $scope.stopupdate();
      showok('Event End Date Updated', $('[name=ends]'));
    });
  }

  $scope.validateTime = function (time) {
    var re = /\d{1,2}([apAP][mM]){1}/;
    return re.test(time) && time.length < 5 && time.length > 2;
  }

  $scope.updatestarttime = function () {
    if ($scope.validateTime($('[name=starts_time]').val())) {
      $scope.startupdate();
      socket.post('/api/event/edit/' + mastereventid, { starts_time: $('[name=starts_time]').val() }).then(function (response) {
        $scope.stopupdate();
        showok('Event Start Time Updated', $('[name=starts_time]'));
      });
    }
    else {
      showok('Invalid Time Entered', $('[name=starts_time]'));
    }
  }

  $scope.updateendtime = function () {
    if ($scope.validateTime($('[name=ends_time]').val())) {
      $scope.startupdate();
      socket.post('/api/event/edit/' + mastereventid, { ends_time: $('[name=ends_time]').val() }).then(function (response) {
        $scope.stopupdate();
        showok('Event End Time Updated', $('[name=ends_time]'));
      });
    }
    else {
      showok('Invalid Time Entered', $('[name=ends_time]'));
    }
  }

  $scope.dirty = false;

  $scope.updaterelease = function () {
    $scope.startupdate();
    socket.post('/api/event/edit/' + mastereventid, {
      release: $('#editor2').cleanHtml(),
      shotrelease: $('#editor').cleanHtml(),
      description: $scope.event.description
    }).then(function (response) {
      // $('.dirty').hide();
      $scope.stopupdate();
      showok('Updated Releases', $('#releaseupdatebtn'));
    });
  }

  $('#editor').wysiwyg().on('change', function () {
    $scope.$apply(function () {
      $scope.dirty = true;
    });
    // $('.dirty').show();
  });
  $('#editor2').wysiwyg().on('change', function () {
    // $('.dirty').show();
    $scope.$apply(function () {
      $scope.dirty = true;
    });
  });

  $scope.notour = function () {
    localStorage["firstrunview"] = true;
  }

  $scope.tour = function () {
    $('#myModal').modal('hide');
    localStorage["firstrunview"] = true;
    bootstro.start('.bootstro', { stopOnBackdropClick: false });
  }

  $scope.locales = [
    {
      "code": "ab",
      "name": "Abkhaz"
    },
    {
      "code": "aa",
      "name": "Afar"
    },
    {
      "code": "af",
      "name": "Afrikaans"
    },
    {
      "code": "ak",
      "name": "Akan"
    },
    {
      "code": "sq",
      "name": "Albanian"
    },
    {
      "code": "am",
      "name": "Amharic"
    },
    {
      "code": "ar",
      "name": "Arabic"
    },
    {
      "code": "an",
      "name": "Aragonese"
    },
    {
      "code": "hy",
      "name": "Armenian"
    },
    {
      "code": "as",
      "name": "Assamese"
    },
    {
      "code": "av",
      "name": "Avaric"
    },
    {
      "code": "ae",
      "name": "Avestan"
    },
    {
      "code": "ay",
      "name": "Aymara"
    },
    {
      "code": "az",
      "name": "Azerbaijani"
    },
    {
      "code": "bm",
      "name": "Bambara"
    },
    {
      "code": "ba",
      "name": "Bashkir"
    },
    {
      "code": "eu",
      "name": "Basque"
    },
    {
      "code": "be",
      "name": "Belarusian"
    },
    {
      "code": "bn",
      "name": "Bengali; Bangla"
    },
    {
      "code": "bh",
      "name": "Bihari"
    },
    {
      "code": "bi",
      "name": "Bislama"
    },
    {
      "code": "bs",
      "name": "Bosnian"
    },
    {
      "code": "br",
      "name": "Breton"
    },
    {
      "code": "bg",
      "name": "Bulgarian"
    },
    {
      "code": "my",
      "name": "Burmese"
    },
    {
      "code": "ca",
      "name": "Catalan; Valencian"
    },
    {
      "code": "ch",
      "name": "Chamorro"
    },
    {
      "code": "ce",
      "name": "Chechen"
    },
    {
      "code": "ny",
      "name": "Chichewa; Chewa; Nyanja"
    },
    {
      "code": "zh",
      "name": "Chinese"
    },
    {
      "code": "cv",
      "name": "Chuvash"
    },
    {
      "code": "kw",
      "name": "Cornish"
    },
    {
      "code": "co",
      "name": "Corsican"
    },
    {
      "code": "cr",
      "name": "Cree"
    },
    {
      "code": "hr",
      "name": "Croatian"
    },
    {
      "code": "cs",
      "name": "Czech"
    },
    {
      "code": "da",
      "name": "Danish"
    },
    {
      "code": "dv",
      "name": "Divehi; Dhivehi; Maldivian;"
    },
    {
      "code": "nl",
      "name": "Dutch"
    },
    {
      "code": "dz",
      "name": "Dzongkha"
    },
    {
      "code": "en",
      "name": "English"
    },
    {
      "code": "eo",
      "name": "Esperanto"
    },
    {
      "code": "et",
      "name": "Estonian"
    },
    {
      "code": "ee",
      "name": "Ewe"
    },
    {
      "code": "fo",
      "name": "Faroese"
    },
    {
      "code": "fj",
      "name": "Fijian"
    },
    {
      "code": "fi",
      "name": "Finnish"
    },
    {
      "code": "fr",
      "name": "French"
    },
    {
      "code": "ff",
      "name": "Fula; Fulah; Pulaar; Pular"
    },
    {
      "code": "gl",
      "name": "Galician"
    },
    {
      "code": "ka",
      "name": "Georgian"
    },
    {
      "code": "de",
      "name": "German"
    },
    {
      "code": "el",
      "name": "Greek, Modern"
    },
    {
      "code": "gn",
      "name": "GuaranÃ­"
    },
    {
      "code": "gu",
      "name": "Gujarati"
    },
    {
      "code": "ht",
      "name": "Haitian; Haitian Creole"
    },
    {
      "code": "ha",
      "name": "Hausa"
    },
    {
      "code": "he",
      "name": "Hebrew (modern)"
    },
    {
      "code": "hz",
      "name": "Herero"
    },
    {
      "code": "hi",
      "name": "Hindi"
    },
    {
      "code": "ho",
      "name": "Hiri Motu"
    },
    {
      "code": "hu",
      "name": "Hungarian"
    },
    {
      "code": "ia",
      "name": "Interlingua"
    },
    {
      "code": "id",
      "name": "Indonesian"
    },
    {
      "code": "ie",
      "name": "Interlingue"
    },
    {
      "code": "ga",
      "name": "Irish"
    },
    {
      "code": "ig",
      "name": "Igbo"
    },
    {
      "code": "ik",
      "name": "Inupiaq"
    },
    {
      "code": "io",
      "name": "Ido"
    },
    {
      "code": "is",
      "name": "Icelandic"
    },
    {
      "code": "it",
      "name": "Italian"
    },
    {
      "code": "iu",
      "name": "Inuktitut"
    },
    {
      "code": "ja",
      "name": "Japanese"
    },
    {
      "code": "jv",
      "name": "Javanese"
    },
    {
      "code": "kl",
      "name": "Kalaallisut, Greenlandic"
    },
    {
      "code": "kn",
      "name": "Kannada"
    },
    {
      "code": "kr",
      "name": "Kanuri"
    },
    {
      "code": "ks",
      "name": "Kashmiri"
    },
    {
      "code": "kk",
      "name": "Kazakh"
    },
    {
      "code": "km",
      "name": "Khmer"
    },
    {
      "code": "ki",
      "name": "Kikuyu, Gikuyu"
    },
    {
      "code": "rw",
      "name": "Kinyarwanda"
    },
    {
      "code": "ky",
      "name": "Kyrgyz"
    },
    {
      "code": "kv",
      "name": "Komi"
    },
    {
      "code": "kg",
      "name": "Kongo"
    },
    {
      "code": "ko",
      "name": "Korean"
    },
    {
      "code": "ku",
      "name": "Kurdish"
    },
    {
      "code": "kj",
      "name": "Kwanyama, Kuanyama"
    },
    {
      "code": "la",
      "name": "Latin"
    },
    {
      "code": "lb",
      "name": "Luxembourgish, Letzeburgesch"
    },
    {
      "code": "lg",
      "name": "Ganda"
    },
    {
      "code": "li",
      "name": "Limburgish, Limburgan, Limburger"
    },
    {
      "code": "ln",
      "name": "Lingala"
    },
    {
      "code": "lo",
      "name": "Lao"
    },
    {
      "code": "lt",
      "name": "Lithuanian"
    },
    {
      "code": "lu",
      "name": "Luba-Katanga"
    },
    {
      "code": "lv",
      "name": "Latvian"
    },
    {
      "code": "gv",
      "name": "Manx"
    },
    {
      "code": "mk",
      "name": "Macedonian"
    },
    {
      "code": "mg",
      "name": "Malagasy"
    },
    {
      "code": "ms",
      "name": "Malay"
    },
    {
      "code": "ml",
      "name": "Malayalam"
    },
    {
      "code": "mt",
      "name": "Maltese"
    },
    {
      "code": "mi",
      "name": "MÄori"
    },
    {
      "code": "mr",
      "name": "Marathi (MarÄá¹­hÄ«)"
    },
    {
      "code": "mh",
      "name": "Marshallese"
    },
    {
      "code": "mn",
      "name": "Mongolian"
    },
    {
      "code": "na",
      "name": "Nauru"
    },
    {
      "code": "nv",
      "name": "Navajo, Navaho"
    },
    {
      "code": "nb",
      "name": "Norwegian BokmÃ¥l"
    },
    {
      "code": "nd",
      "name": "North Ndebele"
    },
    {
      "code": "ne",
      "name": "Nepali"
    },
    {
      "code": "ng",
      "name": "Ndonga"
    },
    {
      "code": "nn",
      "name": "Norwegian Nynorsk"
    },
    {
      "code": "no",
      "name": "Norwegian"
    },
    {
      "code": "ii",
      "name": "Nuosu"
    },
    {
      "code": "nr",
      "name": "South Ndebele"
    },
    {
      "code": "oc",
      "name": "Occitan"
    },
    {
      "code": "oj",
      "name": "Ojibwe, Ojibwa"
    },
    {
      "code": "cu",
      "name": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic"
    },
    {
      "code": "om",
      "name": "Oromo"
    },
    {
      "code": "or",
      "name": "Oriya"
    },
    {
      "code": "os",
      "name": "Ossetian, Ossetic"
    },
    {
      "code": "pa",
      "name": "Panjabi, Punjabi"
    },
    {
      "code": "pi",
      "name": "PÄli"
    },
    {
      "code": "fa",
      "name": "Persian (Farsi)"
    },
    {
      "code": "pl",
      "name": "Polish"
    },
    {
      "code": "ps",
      "name": "Pashto, Pushto"
    },
    {
      "code": "pt",
      "name": "Portuguese"
    },
    {
      "code": "qu",
      "name": "Quechua"
    },
    {
      "code": "rm",
      "name": "Romansh"
    },
    {
      "code": "rn",
      "name": "Kirundi"
    },
    {
      "code": "ro",
      "name": "Romanian, [])"
    },
    {
      "code": "ru",
      "name": "Russian"
    },
    {
      "code": "sa",
      "name": "Sanskrit (Saá¹ská¹›ta)"
    },
    {
      "code": "sc",
      "name": "Sardinian"
    },
    {
      "code": "sd",
      "name": "Sindhi"
    },
    {
      "code": "se",
      "name": "Northern Sami"
    },
    {
      "code": "sm",
      "name": "Samoan"
    },
    {
      "code": "sg",
      "name": "Sango"
    },
    {
      "code": "sr",
      "name": "Serbian"
    },
    {
      "code": "gd",
      "name": "Scottish Gaelic; Gaelic"
    },
    {
      "code": "sn",
      "name": "Shona"
    },
    {
      "code": "si",
      "name": "Sinhala, Sinhalese"
    },
    {
      "code": "sk",
      "name": "Slovak"
    },
    {
      "code": "sl",
      "name": "Slovene"
    },
    {
      "code": "so",
      "name": "Somali"
    },
    {
      "code": "st",
      "name": "Southern Sotho"
    },
    {
      "code": "az",
      "name": "South Azerbaijani"
    },
    {
      "code": "es",
      "name": "Spanish; Castilian"
    },
    {
      "code": "su",
      "name": "Sundanese"
    },
    {
      "code": "sw",
      "name": "Swahili"
    },
    {
      "code": "ss",
      "name": "Swati"
    },
    {
      "code": "sv",
      "name": "Swedish"
    },
    {
      "code": "ta",
      "name": "Tamil"
    },
    {
      "code": "te",
      "name": "Telugu"
    },
    {
      "code": "tg",
      "name": "Tajik"
    },
    {
      "code": "th",
      "name": "Thai"
    },
    {
      "code": "ti",
      "name": "Tigrinya"
    },
    {
      "code": "bo",
      "name": "Tibetan Standard, Tibetan, Central"
    },
    {
      "code": "tk",
      "name": "Turkmen"
    },
    {
      "code": "tl",
      "name": "Tagalog"
    },
    {
      "code": "tn",
      "name": "Tswana"
    },
    {
      "code": "to",
      "name": "Tonga (Tonga Islands)"
    },
    {
      "code": "tr",
      "name": "Turkish"
    },
    {
      "code": "ts",
      "name": "Tsonga"
    },
    {
      "code": "tt",
      "name": "Tatar"
    },
    {
      "code": "tw",
      "name": "Twi"
    },
    {
      "code": "ty",
      "name": "Tahitian"
    },
    {
      "code": "ug",
      "name": "Uyghur, Uighur"
    },
    {
      "code": "uk",
      "name": "Ukrainian"
    },
    {
      "code": "ur",
      "name": "Urdu"
    },
    {
      "code": "uz",
      "name": "Uzbek"
    },
    {
      "code": "ve",
      "name": "Venda"
    },
    {
      "code": "vi",
      "name": "Vietnamese"
    },
    {
      "code": "vo",
      "name": "VolapÃ¼k"
    },
    {
      "code": "wa",
      "name": "Walloon"
    },
    {
      "code": "cy",
      "name": "Welsh"
    },
    {
      "code": "wo",
      "name": "Wolof"
    },
    {
      "code": "fy",
      "name": "Western Frisian"
    },
    {
      "code": "xh",
      "name": "Xhosa"
    },
    {
      "code": "yi",
      "name": "Yiddish"
    },
    {
      "code": "yo",
      "name": "Yoruba"
    },
    {
      "code": "za",
      "name": "Zhuang, Chuang"
    },
    {
      "code": "zu",
      "name": "Zulu"
    }
  ];

}]);


