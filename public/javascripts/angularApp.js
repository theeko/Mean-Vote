"use strict";

  angular.module("myApp", [ "ui.router", "chart.js"])
    
    .config(['$stateProvider', '$urlRouterProvider', 
        function($stateProvider, $urlRouterProvider){
          $stateProvider
            .state('home', {
              url: '/home',
              templateUrl: '/home.html',
              controller: 'mainCtrl'
              })
            .state('pollresult', {
                url: '/polls/{id}',
                templateUrl: '/pollresult.html',
                controller: 'pollresultCtrl',
                resolve: {
                    poll: ['$stateParams', 'polls', function ($stateParams, polls) {
                        return polls.get($stateParams.id);
                    }]
                }
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
                  }]},
                  poll: ['$stateParams', 'polls', function ($stateParams, polls) {
                        return polls.get($stateParams.id);
                    }]
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