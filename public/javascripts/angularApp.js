var app = angular.module("myApp", [ "ui.router"]);

app.config(['$stateProvider', '$urlRouterProvider', 
      function($stateProvider, $urlRouterProvider){
        $stateProvider
          .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'mainCtrl'
            })
          .state('profile', {
            url: '/profile',
            templateUrl: '/profile.html',
            controller: 'profileCtrl',
            onEnter: ["$state", "auth", "polls", function($state, auth, polls){
              if(!auth.isLoggedIn()){
                $state.go("home");
              }}],
            resolve: {
              pollPromise: ['polls', 'auth', function (polls, auth) {
                  return polls.authorsPolls(auth.currentUser());
                }]}
            })
            .state('polls', {
              url: '/polls',
              templateUrl: '/polls.html',
              controller: 'pollCtrl',
              resolve: {
                pollsResolve: ["polls",function(polls){
                  return polls.getAll();
                }]}
            })
          .state('newpoll', {
              url: '/newpoll',
              templateUrl: '/newpoll.html',
              controller: 'newpollCtrl',
              onEnter: ["$state", "auth", function($state, auth){
              if(!auth.isLoggedIn()){
                $state.go("home");
              }}]
            })
          .state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'AuthCtrl',
            onEnter: ["$state", "auth", function($state, auth){
              if(auth.isLoggedIn()){
                $state.go("home");
              }
            }]
            })
            .state("login", {
              url: "/login",
              templateUrl: "/login.html",
              controller: "AuthCtrl",
              onEnter: ['$state', 'auth', function($state, auth){
              if(auth.isLoggedIn()){
                  $state.go('profile');
                }
              }]
            });
        $urlRouterProvider.otherwise('home');
      }
  ]);

app.controller("pollCtrl", ["polls","auth","$scope", function(polls, auth, $scope){
    $scope.polls = polls.polls;
}]);

app.controller("profileCtrl", ["polls","auth","$scope", function(polls, auth, $scope){
    $scope.currentUser = auth.currentUser();
    $scope.polls = polls.polls;
}]);

app.controller("mainCtrl", ["$scope", "polls", "auth", function($scope, polls, auth){
  $scope.polls = polls.polls;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.addPolls = function(){
    if($scope.title == "") {  return; }
    polls.create({
       question: $scope.question, 
       choices: [$scope.choice]
    });
    $scope.question = "";
    $scope.choice = "";
  };
  
  $scope.incrementUpvotes = function(post){
     polls.upvote(post);
  };
}]);

app.factory("polls", ["$http", "auth",function($http, auth){
  var o = { polls: [] };
  
  o.getAll = function(){
    return $http.get("/polls").success(function(data){
      angular.copy(data, o.polls);
    });
  };
  
  o.authorsPolls = function (username) {
        return $http.get('/polls/author/' + username).success(function (data) {
            angular.copy(data, o.polls);
        });
    };
  
  o.create = function(poll){
    return $http.post('/polls', poll, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.polls.push(data);
    });
  };
  
  o.upvote = function(poll) {
    return $http.put('/polls/' + poll._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      poll.upvotes += 1;
    });
  };
  
   o.delete = function(poll) {
        return $http.delete('/polls/' + poll._id, null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        });
    };
  
  o.get = function (id) {
    return $http("/polls/" + id).then(function(res){
      return res.data;
    });
  };
  
  return o;
}]);

app.factory("auth", ["$http", '$window', function($http, $window){
  var auth = {};
  
  auth.saveToken = function(token){
    $window.localStorage["mean-vote-token"] = token;
  };
  
  auth.getToken = function () {
    return $window.localStorage["mean-vote-token"];
  };
  
  auth.isLoggedIn = function(){
    var token = auth.getToken();
  
    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));
  
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };
  
  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
  
      return payload.username;
    }
  };
  
  auth.register = function(user){
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  
  auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  
  auth.logOut = function(){
    $window.localStorage.removeItem('mean-vote-token');
  };
  
  return auth;
}]);

app.controller('AuthCtrl', [
  '$scope',
  '$state',
  'auth',
  function($scope, $state, auth){
    $scope.user = {};
  
    $scope.register = function(){
      auth.register($scope.user).error(function(error){
        $scope.error = error;
      }).then(function(){
        $state.go('home');
      });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);

app.controller('NavCtrl', [
  '$scope',
  'auth',
  function($scope, auth){
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
}]);

app.controller('newpollCtrl', [
  '$scope',
  'auth',
  "polls",
  function($scope, auth,polls){
    $scope.addPolls = function(){
    if($scope.title == "") {  return; }
    polls.create({
       question: $scope.question, 
       choices: [$scope.choice]
    });
    $scope.question = "";
    $scope.choice = "";
  };
}]);