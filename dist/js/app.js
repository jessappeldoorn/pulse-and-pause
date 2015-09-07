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
     controller: 'Login.controller',
     templateUrl: '/templates/dashboard.html',
     authRequired: true,
     resolve: {
      currentAuth: function(Auth) {
        return Auth.$waitForAuth();
      }
     }
   });

   $stateProvider.state('login', {
     url: '/login',
     controller: 'Login.controller',
     templateUrl: '/templates/login.html'
   });

    $stateProvider.state('info', {
     url: '/info',
     controller: 'Home.controller',
     templateUrl: '/templates/info.html'
   });

 }]);

// home controller
app.controller('Home.controller', ['$scope', '$firebaseArray', '$interval', '$timeout', 'Auth', function($scope, $firebaseArray, $interval, $timeout, Auth){
  
  var ref = new Firebase("https://pulseandpause.firebaseio.com"),
  fireTime = Firebase.ServerValue.TIMESTAMP,
  timeEnd,
  counter,
  time, 
  count,
  mySound = new buzz.sound("http://soundjax.com/reddo/56895%5EDING.mp3", {
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
    // check if newTaskText  is undefined
    if ($scope.newTaskText === undefined) { 
      $scope.newTaskText = "Not Labeled"; 
    };

    $scope.newTask = {
      name: $scope.newTaskText,
      created: fireTime,
      session: 1
    };

    $scope.submit();
    $scope.tasks.$add($scope.newTask);
    $scope.newTaskText = "";
  }

  $scope.addTaskName = function() {

    this.name = $scope.taskNewName;
    $scope.submit();
    $scope.tasks.$save(this.newTask);
    console.log(this.name);
  }

  $scope.startWorkTimer = function() {
  //   timerFactory.newSession(); 
  // };
    $interval.cancel(counter);
    timeEnd = " ";

    if($scope.newTask === undefined) {
      $scope.createTask();
    } else {
      $scope.newTask.session += 1;
      $scope.tasks.$save($scope.newTask.session);
      console.log($scope.newTask.session + $scope.newTask.name);
    };

    $scope.timer.text = $scope.newTaskText;
    $scope.timer.mode = "Stop";
    $scope.timer.timer = timeEnd;
    $scope.timer.working = true;
    $scope.timer.onBreak = false;
    $scope.timer.session += 1;
    $scope.timer.workSound = false;
    

    var timeStart = undefined,
    time = undefined;
    timeEnd = new Date().setMilliseconds(1502000); //1502000
    
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
      timeEnd = new Date().setMilliseconds(302000); //302000
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


  Auth.$onAuth(function(authData) {
    $scope.authData = authData;
    console.log(authData);

    // if (authData) {
    //   getUserData();
    // }
  });
    $scope.logout = function() {
    Auth.$unauth();
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
        color:"#C2D8B9"
    },
    {
        value : 30,
        color : "#A1B5D8"
    },
    {
        value : 40,
        color : "#738290"
    },
    {
        value : 10,
        color : "#27213C"
    }

];

var canvas = document.getElementById("hours");
var ctx = canvas.getContext("2d");
new Chart(ctx).Doughnut(data);

var data = {
    labels : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets : [
        {
            fillColor : "rgba(76,36,49,0.7)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [65,54,30,81,56,55,40]
        },
        {
            fillColor : "rgba(167,147,166,0.7)",
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

app.factory('Auth', function($firebaseAuth) {
  var ref = new Firebase("https://pulseandpause.firebaseio.com");
  return $firebaseAuth(ref);
});

app.controller('Login.controller', ['$scope', '$firebaseArray', 'Auth', function($scope, $firebaseArray, Auth) {
  Auth.$onAuth(function(authData) {
    $scope.authData = authData;
    console.log(authData);
  });

  $scope.loginFacebook = function() {
    Auth.$authWithOAuthPopup("facebook").catch(function(error) {
      console.error(error);
    });
  };

   $scope.loginTwitter= function() {
    Auth.$authWithOAuthPopup("twitter").catch(function(error) {
      console.error(error);
    });
  };

   $scope.loginGithub= function() {
    Auth.$authWithOAuthPopup("github").catch(function(error) {
      console.error(error);
    });
  };

     $scope.loginGoogle= function() {
    Auth.$authWithOAuthPopup("google").catch(function(error) {
      console.error(error);
    });
  };
  $scope.logout = function() {
    Auth.$unauth();
  };

// function getUserData() {
//   $http.get($scope.authData.firebase.....)
//   .success(function(...) {
//     $scope.
//   })
// }

// we would probably save a profile when we register new users on our site
// we could also read the profile to see if it's null
// here we will just simulate this with an isNewUser boolean
var isNewUser = true;

var ref = new Firebase("https://pulseandpause.firebaseio.com");
ref.onAuth(function(authData) {
  if (authData && isNewUser) {
    // save the user's profile into the database so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    ref.child("users").child(authData.uid).set({
      provider: authData.provider,
      name: getName(authData)
    });
  }
});

// find a suitable name based on the meta info given by each provider
function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
     case 'github':
       return authData.github.displayName;
     case 'google':
       return authData.google.displayName;
  }
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

// app.factory('userTasks', ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray) {

//   var ref = new Firebase("https://pulseandpause.firebaseio.com");
//   fireTime = Firebase.ServerValue.TIMESTAMP,
//   var tasks = $firebaseArray(ref);
//   //$scope.timer = $firebaseArray(ref);
//   return {
//     allTasks: tasks
//     firebaseArray(ref)
//   };
// }]);

  

//   $scope.tasks = $firebaseArray(ref);
//   $scope.list = [];

//   $scope.submit = function() {
//     if ($scope.newTaskText) {
//       $scope.list.push(this.newTaskText);
//     }
//   };

//   $scope.createTask = function() {
//     // check if newTaskText  is undefined
//     if ($scope.newTaskText === undefined) { 
//       $scope.newTaskText = null; 
//     };

//     $scope.newTask = {
//       name: $scope.newTaskText,
//       created: fireTime,
//       session: 1
//     };

//     $scope.submit();
//     $scope.tasks.$add($scope.newTask);
//     $scope.newTaskText = "";
//   }


// app.factory('timerFactory', function() {

//   var timer = {},
//   counter;
//   timer.newSession = function() { 

//     $interval.cancel(counter);
//     timeEnd = " ";

//     if($scope.newTask === undefined) {
//       $scope.createTask();
//     } else {
//       $scope.newTask.session += 1;
//       console.log($scope.newTask.session + $scope.newTask.name);
//     };

//     $scope.timer.text = $scope.newTaskText;
//     $scope.timer.mode = "Stop";
//     $scope.timer.timer = timeEnd;
//     $scope.timer.working = true;
//     $scope.timer.onBreak = false;
//     $scope.timer.session += 1;
//     $scope.timer.workSound = false;
    

//     var timeStart = undefined,
//     time = undefined;
//     timeEnd = new Date().setMilliseconds(7000); //1502000
    
//     counter = $interval(function(){ 
//       if($scope.timer.working === true){
//         timeStart = new Date().getTime();  
//         time = timeEnd - timeStart;

//         $scope.timer.timer = time;

//         if (time < 250) {
//           $scope.timer.workSound = true;
//           $scope.startBreakTimer();
//         }};
//     }, 1000);  
//   };

//   return timer;

// });


},{}]},{},[1]);