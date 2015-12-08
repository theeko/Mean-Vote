var app = angular.module("myApp", [ "ui.router"]);

app.config(['$stateProvider', '$urlRouterProvider', 
      function($stateProvider, $urlRouterProvider){
        $stateProvider
          .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'mainCtrl'
            })
          .state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'registerCtrl'
            });
        $urlRouterProvider.otherwise('home');
      }
  ]);

app.controller("mainCtrl", function(){
    
});