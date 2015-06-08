(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  var timeEnd,
  counter;
 // var fireTime = Firebase.ServerValue.TIMESTAMP;
  $scope.timer = {
    date: new Date (),
    timer: "READY",
    mode: "Start"
  };
  // $scope.tasks = $firebaseArray(ref);
  //timeEnd = 0;

  $scope.startTimer = function() {
    console.log('started timer');
    $scope.timer.mode = "Reset";
    $scope.timer.timer = timeEnd;

    var timeStart = undefined;
    var time = undefined;
    timeEnd = new Date().setMilliseconds(1502000);

    counter = $interval(function(){ 
      if ( $scope.timer.mode === 'Reset' ) {
        timeStart = new Date().getTime();  
        time = timeEnd - timeStart;

       // console.log('timeStart: ' + timeStart + " " + 'time: ' + time);

        $scope.timer.timer = time;

        if (time < 250){
          $scope.timer.timer = "READY";
          $scope.timer.mode = "Start";
        };
      }
    }, 1000);    
  };

  $scope.toggleTimer = function() {
    if($scope.timer.mode === "Start") {
      $scope.startTimer();
    } else {
      $scope.resetTimer();
    }
  }

  $scope.resetTimer = function() {
    console.log('reset timer');
    // reset counting
    $interval.cancel(counter);
    timeEnd = " ";
    $scope.timer.date = new Date();
    $scope.timer.timer = "READY";
    $scope.timer.mode = "Start";

  };

 $scope.stopTime = function () {
  console.log('clicked');
  // on start run startTimer
  if ($scope.timer.mode === 'Reset' ) {
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







},{}]},{},[1]);