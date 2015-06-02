// add angular module
// inject firebase
var app = angular.module("Pulseandpause", ["firebase", "ui.router"]);

 app.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
   $locationProvider.html5Mode(true);
 
   $stateProvider.state('home', {
     url: '/',
     controller: 'Home.controller',
     templateUrl: '/templates/home.html'
   });

   $stateProvider.state('timer', {
     url: '/timer',
     controller: 'timer.controller',
     templateUrl: '/templates/timer.html'
   });

   $stateProvider.state('dashboard', {
     url: '/dashboard',
     controller: 'Dashboard.controller',
     templateUrl: '/templates/dashboard.html'
   });

 }]);

// home controller
app.controller('Home.controller', ['$scope', '$firebaseArray', '$interval', '$timeout', function($scope, $firebaseArray, $interval, $timeout){
  var ref = new Firebase("https://pulseandpause.firebaseio.com");

// create a synchronized (psuedo read-only) array
  $scope.tasks = $firebaseArray(ref);
  var fireTime = Firebase.ServerValue.TIMESTAMP;

  $scope.date = new Date ();

  $scope.timer = "25:00";
  $scope.mode = "Start";
  
  $scope.countDown = function () {
    $scope.timer--;
    $scope.timeout = $timeout(countdown, 1000);
  }
  
  $scope.startTimer = function() {
    $scope.timer--;
    $scope.timeout = $timeout(countdown, 1000);
  }
  
  $scope.stopTimer = function() {
    $timeout.cancel($scope.timeout);
  };

 $scope.toggleTimer = function () {
    console.log("start timer test");

    if ($scope.mode === 'Start') {
     //   startTimer();
        $scope.mode = 'Stop';
    } else {
       // stopTimer();
        $scope.mode = 'Start'
    };
        console.log("start timer test");


};
  //$interval( function(){ $scope.startTimer(); }, 25000);


}]);

app.controller('Timer.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
  var ref = new Firebase("https://pulseandpause.firebaseio.com");
// create a synchronized (psuedo read-only) array
// all server changes are downloaded in realtime



}]);

app.controller('Dashboard.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
  var ref = new Firebase("https://pulseandpause.firebaseio.com");
// create a synchronized (psuedo read-only) array



}]);
