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
  // create a synchronized (psuedo read-only) array
  var ref = new Firebase("https://pulseandpause.firebaseio.com");
  var timeEnd = 1500000;
  var counter;
 // var fireTime = Firebase.ServerValue.TIMESTAMP;
  $scope.timer = {
    date: new Date (),
    timer: "READY",
    mode: "Ready"
  };
  // $scope.tasks = $firebaseArray(ref);
  //timeEnd = 0;

  $scope.startTimer = function() {
    console.log('started timer');
    $scope.timer.mode = "Started";
    $scope.timer.timer = timeEnd;

    var timeStart = undefined;
    var time = undefined;

    counter = $interval(function(){ 
      if ( $scope.timer.mode === 'Started' ) {
        timeStart = new Date().getTime();  
        time = timeEnd - timeStart;

        console.log('timeStart ' + timeStart + 'time: ' + time);

        $scope.timer.timer = time;

        if ( timeStart === timeEnd ){
          $scope.timer.timer = time;
        };
      }
    }, 1000);    
  };

  $scope.resetTimer = function() {
    console.log('reset timer');
    // reset counting
    $scope.startTimer();
  };

 $scope.stopTime = function () {
  console.log('clicked');
  // on start run startTimer
  if ($scope.timer.mode === 'Started' ) {
    $interval.cancel( counter );
  } 
};
  //$interval( function(){ $scope.startTimer(); }, 25000);


}]);

// Start a new work session.
// Click the reset button. Verify that Bloctime resets the timer, the text and the button.

app.controller('Timer.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
  var ref = new Firebase("https://pulseandpause.firebaseio.com");
// create a synchronized (psuedo read-only) array
// all server changes are downloaded in realtime



}]);

app.controller('Dashboard.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
  var ref = new Firebase("https://pulseandpause.firebaseio.com");
// create a synchronized (psuedo read-only) array



}]);

app.directive('ngStopwatch', ['$interval', function($interval) {
  return {
    templateUrl: '/templates/directives/stopwatch.html',
    replace: true,
    controller: 'Home.controller',
    restrict: 'AE'
};
}]);






