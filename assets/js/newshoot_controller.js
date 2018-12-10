bootleggerApp.controller('newshoot', ['$scope', '$bootleggerSails', '$timeout', '$sce', 'usSpinnerService', '$interval', '$filter', '$rootScope', '$http', function ($scope, socket, $timeout, $sce, usSpinnerService, $interval, $filter, $rootScope, $http) {

  $scope.chosenTemplate = {};

  $scope.chooseTemplate = function (chosen) {
    $scope.chosenTemplate = chosen;
    $('#carousel').carousel(1);
    $('#evtyp').val(chosen.id);
    $('#adjust').attr('href', '/commissioning/create/' + chosen.id);
  }

  socket.get('/api/commission/seedtemplates/').then(function (response) {
    $scope.templates = response.data;
  });

  $('.datepicker').datepicker().on('changeDate', function () {
    $(this).datepicker('hide');
  });
}]);