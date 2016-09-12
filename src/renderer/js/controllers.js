//import db from 'nedb';
//ws
'use strict';
angular.module('app', ['ngMaterial', 'electangular'])

// database
.factory('db', function() {
  var db = new Nedb({
    filename: 'storage.db',
    autoload: true
  });
  return db;
})

.run(['$rootScope', function($rootScope) {
  //listen for host messages
  $rootScope.$on('electron-host', function(evt, data) {
    console.log( data + " from HOST" );
  });
}])

.controller('HomeController', ['$scope','$rootScope', 'electron', 'ipc', 'db', function($scope, $rootScope, electron, ipc, db) {
  console.log("home controller")
  $scope.count = 0;
  $rootScope.$on('electron-msg', (event, msg) => {
    console.log(msg);
    var doc = { hello: 'world'
               , n: 5
               , today: new Date()
               , nedbIsAwesome: true
               , notthere: null
               , notToBeSaved: undefined  // Will not be saved
               , fruits: [ 'apple', 'orange', 'pear' ]
               , infos: { name: 'nedb' }
               };

    db.insert(doc, function (err, newDoc) {   // Callback is optional
      console.log("inserted")
    });
    $scope.updateCount = function() {
      db.count({}, function (err, count) {
        $scope.count = count;
        $scope.$apply();
        console.log("count: "+count);
      });
    }
    $scope.updateCount();
  });

  setInterval(function() {
    //ipc.send("Here is a message to main");
  }, 3000)

  $scope.showError = function(err) {
    electron.dialog.showErrorBox('Error Title', err);
  }
}]);
