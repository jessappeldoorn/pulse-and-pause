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
  
  var ref = new Firebase("https://pulseandpause.firebaseio.com"),
  fireTime = Firebase.ServerValue.TIMESTAMP,
  timeEnd,
  counter,
  time, 
  count,
  mySound = new buzz.sound("http://soundbible.com/grab.php?id=1746&type=mp3", {
    preload: true
  });

  $scope.tasks = $firebaseArray(ref);
  $scope.list = [];
  $scope.timer = {
    text: undefined,
    date: new Date (),
    timer: "READY",
    mode: "Start",
    onBreak: false,
    working: false,
    session: 0,
    created: undefined,
    workSound: false,
    breakSound: false
  };

  $scope.submit = function() {
    if ($scope.newTaskText) {
      $scope.list.push(this.newTaskText);
    }
  };

  $scope.$watch('timer.breakSound', function(newValue, oldValue) {
    if(newValue) {
      mySound.play();
    }
  }); 

  $scope.$watch('timer.workSound', function(newValue, oldValue) {
      if(newValue) {
      mySound.play();
    }
  });

  $scope.createTask = function() {
    $scope.newTask = {
      name: $scope.newTaskText,
      created: fireTime,
      session: 1
    };

        if($scope.newTask.name === undefined) {
        $scope.newTask.name = null;
    };
    $scope.submit();
    $scope.tasks.$add($scope.newTask);
    $scope.newTaskText = "";
  }

  $scope.startWorkTimer = function() {
    $interval.cancel(counter);
    timeEnd = " ";

    
    $scope.createTask();

  
    

    // var newSession = {
    //   name: $scope.newTaskText,
    //   created: fireTime,
    //   session: 1
    // };

    // $scope.submit();
    

    // $scope.tasks.$add(newTask);
    // $scope.newTaskText = "";

    $scope.timer.text = $scope.newTaskText;
    $scope.timer.mode = "Stop";
    $scope.timer.timer = timeEnd;
    $scope.timer.working = true;
    $scope.timer.onBreak = false;
    $scope.timer.session += 1;
    $scope.timer.workSound = false;
    

    var timeStart = undefined,
    time = undefined;
    timeEnd = new Date().setMilliseconds(7000); //1502000
    
    counter = $interval(function(){ 
      if($scope.timer.working === true){
        timeStart = new Date().getTime();  
        time = timeEnd - timeStart;

        $scope.timer.timer = time;

        if (time < 250) {
          $scope.timer.workSound = true;
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
    $scope.timer.breakSound = false;
    

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
          $scope.timer.breakSound = true;
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
    $scope.list.pop(this.newTaskText);
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





