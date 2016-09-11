//import db from 'nedb';
//ws
'use strict';
angular.module('app', ['ngMaterial', 'electangular'])

.controller('HomeController', ['$scope','electron', function($scope, electron) {
  console.log("home controller")
  $scope.showError = function(err) {
    electron.dialog.showErrorBox('Error Title', err);
  }

}]);
