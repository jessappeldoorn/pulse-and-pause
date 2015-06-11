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

  var timerSound = new buzz.sound( "/sounds/ding1", {
    format: "mp3",
    preload: true
  });

  console.log($scope.allTasks);

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

    $scope.tasks.$add(newTask); // Push into array
    $scope.newTaskText = "";
  };


  $scope.timer = {
    date: new Date (),
    timer: "READY",
    mode: "Start Working",
    onBreak: false,
    working: false,
    session: 0
  };
  // $scope.tasks = $firebaseArray(ref);
  //timeEnd = 0;

  $scope.startWorkTimer = function() {
    console.log('started work');

    $interval.cancel(counter);
    timeEnd = " ";
    $scope.timer.date = new Date();
    $scope.timer.timer = "READY";
  
    $scope.timer.mode = "Reset Work Timer";
    $scope.timer.timer = timeEnd;
    $scope.timer.session += 1;
    $scope.timer.working = true;

    var timeStart = undefined,
    time = undefined;
    timeEnd = new Date().setMilliseconds(7000); //1502000
    

    counter = $interval(function(){ 
      if ( $scope.timer.mode === 'Reset Work Timer' ) {
        timeStart = new Date().getTime();  
        time = timeEnd - timeStart;

       // console.log('timeStart: ' + timeStart + " " + 'time: ' + time);

        $scope.timer.timer = time;

        if (time < 250 && $scope.timer.session < 4) {
          $scope.timer.timer = "READY";
          $scope.timer.mode = "Start Break";
          $scope.timer.onBreak = true;
          $scope.timer.working = false;
          console.log($scope.timer.session);
          timerSound.play();
        } else if (time < 250 && $scope.timer.session === 4) {
            $scope.timer.timer = "READY";
            $scope.timer.mode = "Start Long Break";
            $scope.timer.onBreak = true;
            $scope.timer.working = false;
            console.log("On a long break" + " " + $scope.timer.session);
            $scope.timer.session = 1;
        }};
    }, 1000);  
  };

  $scope.startBreakTimer = function() {
    console.log('started break');
    $scope.timer.mode = "Reset Break Timer";
    $scope.timer.timer = timeEnd;

    $interval.cancel(counter);
    timeEnd = " ";
    $scope.timer.date = new Date();
    $scope.timer.timer = "READY";
    $scope.timer.working = false;

    var timeStart = undefined;
    var time = undefined;
    timeEnd = new Date().setMilliseconds(7000); //302000

    counter = $interval(function(){ 
      if ( $scope.timer.mode === 'Reset Break Timer' ) {
        timeStart = new Date().getTime();  
        time = timeEnd - timeStart;

       // console.log('timeStart: ' + timeStart + " " + 'time: ' + time);

        $scope.timer.timer = time;

        if (time < 250){
          $scope.timer.timer = "READY";
          $scope.timer.mode = "Start Working";
          $scope.timer.onBreak = false;
        };
      }
    }, 1000); 
  }

    $scope.startLongBreakTimer = function() {
    console.log('started long break');
    $scope.timer.mode = "Reset Long Break Timer";
    $scope.timer.timer = timeEnd;

    $interval.cancel(counter);
    timeEnd = " ";
    $scope.timer.date = new Date();
    $scope.timer.timer = "READY";
    $scope.timer.working = false;

    var timeStart = undefined;
    var time = undefined;
    timeEnd = new Date().setMilliseconds(1802000); //302000

    counter = $interval(function(){ 
      if ( $scope.timer.mode === 'Reset Long Break Timer' ) {
        timeStart = new Date().getTime();  
        time = timeEnd - timeStart;

       // console.log('timeStart: ' + timeStart + " " + 'time: ' + time);

        $scope.timer.timer = time;

        if (time < 250){
          $scope.timer.timer = "READY";
          $scope.timer.mode = "Start Working";
          $scope.timer.onBreak = false;
        };
      }
    }, 1000); 
  }

  $scope.toggleTimer = function() {
    if($scope.timer.mode === "Start Working") {
      $scope.startWorkTimer();
    } else if ($scope.timer.mode === "Start Break" ) {
      $scope.startBreakTimer(); 
    } else if ($scope.timer.mode === "Start Long Break") {
      $scope.startLongBreakTimer() } else {
      $scope.resetTimer();
    }
  };
  
  $scope.resetTimer = function() {
    console.log('reset timer');
    // reset counting
    $interval.cancel(counter);
    timeEnd = " ";
    $scope.timer.date = new Date();
    $scope.timer.timer = "READY";

      if ($scope.timer.mode === "Reset Work Timer") {
        $scope.timer.mode = "Start Working";
      } else if ($scope.timer.mode === "Reset Break Timer") {
        $scope.timer.mode = "Start Break";
      } 
  };

    $scope.$watch(function(scope) { return scope.timer.timer },
      function(newValue, oldValue) { console.log("something happened"), timerSound.play(); }
    );


    


 /*$scope.stopTime = function () {
  console.log('clicked');
  // on start run startTimer
  if ($scope.timer.mode === 'Reset' ) {
    $interval.cancel( counter );
  } 
};*/

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
    restrict: 'E'
};


}]);

app.factory('Tasks', ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray) {

  // create a synchronized (psuedo read-only) array
  var ref = new Firebase("https://pulseandpause.firebaseio.com");

  
var tasks = $firebaseArray(ref);


  return {
    allTasks: tasks
  }

}]);





