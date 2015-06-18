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
app.controller('Home.controller', ['$scope', '$firebaseArray', '$interval', '$timeout', 'taskFactory', 'timerFactory' function($scope, $firebaseArray, $interval, $timeout, taskFactory, timerFactory){
  
  var ref = new Firebase("https://pulseandpause.firebaseio.com"),
  // fireTime = Firebase.ServerValue.TIMESTAMP,
  var timeEnd,
  counter,
  time, 
  count


  // $scope.tasks = $firebaseArray(ref);
  // $scope.list = [];
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
  $scope.tasks = taskFactory.tasks;
  $scope.submit = taskFactory.addTask($scope.newTaskText, $scope.list);


  $scope.createTask = function() {
    // check if newTaskText  is undefined
    if ($scope.newTaskText === undefined) { 
      $scope.newTaskText = null; 
    };

    $scope.newTask = {
      name: $scope.newTaskText,
      created: fireTime,
      session: 1
    };

    $scope.submit();
    // $scope.tasks.$add($scope.newTask);
    taskFactory.addToFirebase($scope.newTask);

    $scope.newTaskText = "";
  }

  $scope.startWorkTimer = function() {
    $interval.cancel(counter);
    timeEnd = " ";

    if($scope.newTask === undefined) {
      $scope.createTask();
    } else {
      $scope.newTask.session += 1;
      console.log($scope.newTask.session + $scope.newTask.name);
    };

    $scope.timer.text = $scope.newTaskText;
    $scope.timer.mode = "Stop";
    $scope.timer.timer = timeEnd;
    $scope.timer.working = timerFactory.timerWorking;
    $scope.timer.onBreak = false;
    $scope.timer.session += 1;
    $scope.timer.workSound = false;
    

    var timeStart = undefined,
    time = undefined;
    timeEnd = new Date().setMilliseconds(7000); //1502000
    
    counter = timerFactory.counter; // function?
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
     $scope.newTaskText = "";
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
  var data = [
    {
        value: 20,
        color:"#637b85"
    },
    {
        value : 30,
        color : "#2c9c69"
    },
    {
        value : 40,
        color : "#dbba34"
    },
    {
        value : 10,
        color : "#c62f29"
    }

];

var canvas = document.getElementById("hours");
var ctx = canvas.getContext("2d");
new Chart(ctx).Doughnut(data);

var data = {
    labels : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets : [
        {
            fillColor : "rgba(99,123,133,0.4)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [65,54,30,81,56,55,40]
        },
        {
            fillColor : "rgba(219,186,52,0.4)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [20,60,42,58,31,21,50]
        },
    ]
}
var canvas = document.getElementById("shipments");
var ctx = canvas.getContext("2d");
new Chart(ctx).Line(data);

var data = {
    labels : ["Helpful","Friendly","Kind","Rude","Slow","Frustrating"],
    datasets : [
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "#637b85",
            pointColor : "#dbba34",
            pointStrokeColor : "#637b85",
            data : [65,59,90,81,30,56]
        }
    ]
}
$scope.canvas = document.getElementById("departments");
var ctx = $scope.canvas.getContext("2d");
new Chart(ctx).Radar(data);


}]);

app.controller('Login.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
  var ref = new Firebase("https://pulseandpause.firebaseio.com");
// create a synchronized (psuedo read-only) array
  $scope.user = $firebaseArray(ref);

  $scope.createUser = function() {
    var newUser = {
      email: $scope.userEmail,
      password: $scope.userPassword
    };

    $scope.user.$add(newUser);
    $scope.userEmail = "";
    $scope.userPassword = "";
  }

}]);

app.directive('ngStopwatch', ['$interval', function($interval) {
  return {
    templateUrl: '/templates/directives/stopwatch.html',
    replace: true,
    controller: 'Home.controller',
    restrict: 'E'
  };
}]);

app.factory('taskFactory', ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray) {
  var ref = new Firebase("https://pulseandpause.firebaseio.com"),
  fireTime = Firebase.ServerValue.TIMESTAMP,
  
  //$scope.timer = $firebaseArray(ref);

  return { 
    tasks: $firebaseArray(ref),
    addToFirebase: function(task){
      tasks.$add(task)
    },
    fireTime: fireTime,
    list: [],
    addTask = function(text, array) {
      if (text) {
        array.push(text)
      }
    }
  }
}]);

app.factory('timerFactory', function() {

  return {
    sound: new buzz.sound("http://soundjax.com/reddo/56895%5EDING.mp3", {
      preload: true
    }),

    breakCheck: function(){
        $scope.$watch('timer.breakSound', function(newValue, oldValue) {
        if(newValue !== oldValue) {
          console.log(this.sound);
          this.sound.play();
        }
      });
    } ,

    workCheck: function(){
        $scope.$watch('timer.workSound', function(newValue, oldValue) {
        if(newValue !== oldValue) {
          console.log(this.sound);
          this.sound.play();
        }
      });
    }, 

    timerWorking: true,

    counter: function(){
      this.counterInterval = $interval(function(){ 
      // TODO: replace $scope references to references on our timerFactory object (this)
      if(this.timerWorking === true){
        timeStart = new Date().getTime();  
        time = timeEnd - timeStart;

        $scope.timer.timer = time;

        if (time < 250) {
          $scope.timer.workSound = true;
          $scope.startBreakTimer();
        }};
    }, 1000);

    },
    stopCounter: function(){
      $window.clearInterval(this.counter);
    }
  }

});




