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
 // $scope.tasks = $firebaseArray(ref);
 // var fireTime = Firebase.ServerValue.TIMESTAMP;
  $scope.date = new Date ();
  $scope.timer = "READY";
  $scope.mode = "Ready";
  

  var timeEnd = new Date().setMilliseconds(1502000);
  
  //timeEnd = 0;

  $scope.startTimer = function() {
    console.log('started timer');
    $scope.mode = "Started";
   
     var timeStart = new Date().getTime();  
      var time = timeEnd - timeStart;
      $scope.timer = time;
    

      if( timeStart === timeEnd ){
        $scope.timer = time;
      };
    };

  $scope.resetTimer = function() {
    console.log('reset timer');
    $interval.cancel(counter);
    $scope.mode = "Reset";
    $scope.startTimer();

  };


 $scope.toggleTimer = function () {
  console.log('clicked');
  var counter = $interval( function(){ $scope.startTimer(); }, 1000);

    // on start run startTimer

    if ($scope.mode === 'Ready') {
      $scope.startTimer();

    } else {
      $scope.resetTimer();
        
    };
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
    restrict: 'AE',

    scope: {}, // Creates a scope that exists only in this directive.
    


         //$interval( function(){ $scope.startTimer(); }, 25000);
};
}]);






