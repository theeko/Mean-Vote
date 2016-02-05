angular.module("myApp").factory("polls", ["$http", "auth",function($http, auth){
    var o = { polls: [] };
    
o.getAll = function(){
  return $http.get("/polls").success(function(data){
    angular.copy(data, o.polls);
  });
};

o.upvote = function(poll, pollid, index){
  return $http.put('/polls/' + pollid + "/" + index, null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
    poll.choices[index].votes +=1;
    // window.location.href = "#polls";
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
     window.location.href = "#profile"
  });
};

 o.delete = function(id) {
      return $http.delete('/polls/' + id, null, {
          headers: {Authorization: 'Bearer ' + auth.getToken()}
      });
  };

o.get = function (id) {
  return $http.get("/polls/" + id).success(function(res){
    return res.data;
  }).error(function(err){console.log(err) });
};

return o;
}]);

angular.module("myApp").factory("auth", ["$http", '$window', function($http, $window){
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