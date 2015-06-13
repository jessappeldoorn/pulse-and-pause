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
     controller: 'Home.controller',
     templateUrl: '/templates/dashboard.html'
   });

   $stateProvider.state('login', {
     url: '/login',
     controller: 'Login.controller',
     templateUrl: '/templates/login.html'
   });

 }]);

// home controller
app.controller('Home.controller', ['$scope', '$firebaseArray', '$interval', '$timeout', function($scope, $firebaseArray, $interval, $timeout){
  
  var ref = new Firebase("https://pulseandpause.firebaseio.com");


  $scope.tasks = $firebaseArray(ref);

  var fireTime = Firebase.ServerValue.TIMESTAMP;
  var timeEnd,
  counter,
  time,
  count;


  var mySound = new buzz.sound("http://soundjax.com/reddo/56895%5EDING.mp3", {
    preload: true
  });

  console.log("this is a message about allTasks" + " " + $scope.allTasks);

  $scope.list = [];
  $scope.submit = function() {
    if ($scope.newTaskText) {
      $scope.list.push(this.newTaskText);
    }
  };

  $scope.timer = {
    text: undefined,
    date: new Date (),
    timer: "READY",
    mode: "Start",
    onBreak: false,
    working: false,
    session: 0,
    created: undefined
  };


  $scope.addTask = function() { // add task to history list
    var newTask = {
    text: $scope.newTaskText,
    created: fireTime,
  }
    

    $scope.submit();

    $scope.tasks.$add(newTask); // Push into array
    $scope.newTaskText = "";
  };

    $scope.$watch('timer.timer', function(newValue, oldValue) {
      console.log("We have a newValue");
              mySound.play();

      if(newValue < 250) {
        mySound.play();
        console.log("doing something");
      }
    }); 

  /*  $scope.$watch(function(scope) { 
      return scope.timer.timer }, function(newValue, oldValue) {
        if(newValue < 250) {
      mySound.play(); 
      console.log("supposed to do something here"); };
  }); */
  // $scope.tasks = $firebaseArray(ref);
  //timeEnd = 0;

  $scope.startWorkTimer = function() {
    console.log('started work');

    $interval.cancel(counter);
    timeEnd = " ";

    var newSession = {
      name: $scope.newTaskText,
      created: fireTime
    };

    $scope.submit();
    

    $scope.tasks.$add(newSession);
    $scope.newTaskText = "";


    $scope.timer.mode = "Stop";
    $scope.timer.timer = timeEnd;
    $scope.timer.working = true;
    $scope.timer.onBreak = false;
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
          mySound.play();
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
    $scope.timer.name = " ",
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

app.controller('Login.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
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

/*app.factory('Tasks', ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray) {

  var ref = new Firebase("https://pulseandpause.firebaseio.com");
  var tasks = $firebaseArray(ref);
  //$scope.timer = $firebaseArray(ref);
  return {
    allTasks: tasks
  }
}]);*/





