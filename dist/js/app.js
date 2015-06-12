(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = angular.module("Pulseandpause", ["firebase", "ui.router"]);

 app.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
   $locationProvider.html5Mode(true);
 
   $stateProvider.state('home', {
     url: '/',
     controller: 'Home.controller',
     templateUrl: '/templates/home.html'
   });

   $stateProvider.state('dashboard', {
     url: '/dashboard',
     controller: 'Dashboard.controller',
     templateUrl: '/templates/dashboard.html'
   });

   $stateProvider.state('login', {
     url: '/login',
     controller: 'Login.controller',
     templateUrl: '/templates/login.html'
   });

 }]);

// home controller
app.controller('Home.controller', ['$scope', '$firebaseArray','Tasks', '$interval', '$timeout', function($scope, $firebaseArray, Tasks, $interval, $timeout){

  var fireTime = Firebase.ServerValue.TIMESTAMP;
  var timeEnd,
  counter,
  time,
  count;

  var mySound = new buzz.sound("/assets/sounds/ding1.mp3", {
    preload: true
  });

  console.log("this is a message about allTasks" + " " + $scope.allTasks);

  $scope.list = [];
  $scope.submit = function() {
    if ($scope.newTaskText) {
      $scope.list.push(this.newTaskText);
    }
  };

  $scope.addTask = function() { // add task to history list
    $scope.newTask = {
      text: $scope.newTaskText,
      created: fireTime,
    };

    $scope.submit();

    tasks.$add(newTask); // Push into array
    $scope.newTaskText = "";
  };

  $scope.timer = {
    name: $scope.newTaskText,
    date: new Date (),
    timer: "READY",
    mode: "Start",
    onBreak: false,
    working: false,
    session: 0
  };

    $scope.$watch(function(scope) { 
      return scope.timer.working }, function(newValue, oldValue) {
      mySound.play(); 
      console.log("supposed to do something here");
  }); 
  // $scope.tasks = $firebaseArray(ref);
  //timeEnd = 0;

  $scope.startWorkTimer = function() {
    console.log('started work');

    $interval.cancel(counter);
    timeEnd = " ";

    $scope.timer.mode = "Stop";
    $scope.timer.timer = timeEnd;
    $scope.timer.working = true;
    $scope.timer.session += 1;
    
    var timeStart = undefined,
    time = undefined;
    timeEnd = new Date().setMilliseconds(7000); //1502000
    
    counter = $interval(function(){ 
      if($scope.timer.working === true){
        timeStart = new Date().getTime();  
        time = timeEnd - timeStart;

        $scope.timer.timer = time;

        if (time < 250) {
          $scope.startBreakTimer();
        }};
    }, 1000);  
  };

  $scope.startBreakTimer = function() {
    console.log('started break timer');
    $scope.timer.timer = timeEnd;
    $interval.cancel(counter);
    timeEnd = " ";
    $scope.timer.date = new Date();
    $scope.timer.timer = "READY";
    $scope.timer.onBreak = true;
    $scope.timer.working = false;

    var timeStart = undefined;
    var time = undefined;

    if($scope.timer.session <= 3) {
      console.log("On a short break" + " " + $scope.timer.session);
      timeEnd = new Date().setMilliseconds(7000); //302000
      $scope.timer.mode = "Stop";   
    } else {
       console.log("On a long break" + " " + $scope.timer.session);
       timeEnd = new Date().setMilliseconds(1802000); //302000
       $scope.timer.mode = "Stop";
       $scope.timer.session = 0;
    };

    counter = $interval(function(){ 
      if ($scope.timer.onBreak){
        timeStart = new Date().getTime();  
        time = timeEnd - timeStart;

        $scope.timer.timer = time;

        if (time < 250){
          $scope.startWorkTimer();
        };
      }
    }, 1000); 
  };

  $scope.toggleTimer = function() {
    if($scope.timer.mode === "Start"){
      $scope.startWorkTimer();
    } else {
        $scope.resetTimer();
    }
  };
  
  $scope.resetTimer = function() {
    $interval.cancel(counter);
    timeEnd = " ";
    $scope.timer.name = $scope.newTaskText,
    $scope.timer.date = new Date (),
    $scope.timer.timer = "READY",
    $scope.timer.mode = "Start",
    $scope.timer.onBreak = false,
    $scope.timer.working = false,
    $scope.timer.session = 0
  };



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

app.directive('ngStopwatch', ['$interval', function($interval) {
  return {
    templateUrl: '/templates/directives/stopwatch.html',
    replace: true,
    controller: 'Home.controller',
    restrict: 'E'
};


   



}]);

app.factory('Tasks', ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray) {

  var ref = new Firebase("https://pulseandpause.firebaseio.com");
  var tasks = $firebaseArray(ref);
  //$scope.timer = $firebaseArray(ref);
  return {
    allTasks: tasks
  }
}]);






},{}]},{},[1]);