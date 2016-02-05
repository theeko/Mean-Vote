angular.module("myApp").controller("pollCtrl", ["polls","auth","$scope", function(polls, auth, $scope){
      $scope.polls = polls.polls;
      
      $scope.upvote= function(poll, pollid,index){
        if(!auth.isLoggedIn()){ return; }
        polls.upvote(poll, pollid,index);
        
      };
  }]);
  
angular.module("myApp").controller("profileCtrl", ["polls","auth","$scope", "poll", function(polls, auth, $scope, poll){
  $scope.currentUser = auth.currentUser();
  $scope.polls = polls.polls;
  $scope.poll = poll
  $scope.deletePoll = function(id, poll){
    if($scope.currentUser == poll.author){
    polls.delete(id);
     window.location.href = "#profile";
    }
  };
  $scope.upvote= function(poll, pollid,index){
    if(!auth.isLoggedIn()){ return; }
    polls.upvote(poll, pollid,index);
    
  };
  $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
$scope.data = [300, 500, 100, 40, 120];
}]);

angular.module("myApp").controller("mainCtrl", ["$scope", "polls", "auth", function($scope, polls, auth){
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

}]);

angular.module("myApp").controller("profileCtrl", ["polls","auth","$scope", function(polls, auth, $scope){
  $scope.currentUser = auth.currentUser();
  $scope.polls = polls.polls;
  $scope.deletePoll = function(id, poll){
    if($scope.currentUser == poll.author){
    polls.delete(id);
     window.location.href = "#profile";
    }
  };
  $scope.upvote= function(poll, pollid,index){
    if(!auth.isLoggedIn()){ return; }
    polls.upvote(poll, pollid,index);
    
  };
  
}]);

angular.module("myApp").controller("pollresultCtrl", ["$scope", "polls", "auth", "poll", function($scope, polls, auth, poll){


  $scope.poll = poll;
$scope.labels = [];
$scope.data = [];  

  for(var i =0; i<poll.data[0].choices.length; i++){
    $scope.labels.push(poll.data[0].choices[i].option);
    $scope.data.push(poll.data[0].choices[i].votes);
  }

}]);

angular.module("myApp").controller('AuthCtrl', [
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

angular.module("myApp").controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);

angular.module("myApp").controller('newpollCtrl', [
'$scope',
'auth',
"polls",
function($scope, auth,polls){
  $scope.polls = polls.polls;
  var choices = 3;
  $scope.choices = [
    { choice: $scope.choice1, votes: 0 },
    { choice: $scope.choice1, votes: 0 }
    ]
  
  $scope.addChoice = function(){
    var newcho = "choice" + choices;
    $scope.error = "";
    $scope.choices.push({ choice: $scope.newcho, votes: 0});
    
    choices +=1;
  };
  
  $scope.addPoll = function(){
    if(!$scope.question && $scope.question == "") {  $scope.error = "Need a question"; return; }
    if(!auth.isLoggedIn()) {  $scope.error = "You must log in"; return; }
    polls.create({
       question: $scope.question, 
       choices: $scope.choices
    });
    $scope.error = "";
  };
}]);