'use strict';

angular.module('Auth_app',['ngRoute']).factory('AuthService',($http) => {

  var USER = {};
  USER.login = function (username, password){
    return $http({
      method: "POST",
      url: "/login",
      data: {
        user: username,
        passwd: password
      }
    })
  };

  USER.logout = function(){
    return $http.get('/logout');
  };

  return USER;

}).config(function($routeProvider){
  $routeProvider.when('/', {
    controller: 'LoginController',
    templateUrl: 'Login.html'
  }).otherwise({
    redirectTo: '/'
  })
}).controller('LoginController', function($scope, $location, USER){
  $scope.registered = false;
  $scope.user = "";
  $scope.passwd = "";

  $scope.register = () =>{
    USER.login($scope.user, $scope.passwd)
      .then(function(response){
        $scope.registered = response.data.id != undefined;
        if($scope.registered){
          $scope.userdata = response.data;
          $location.path('/index2.html');
        }
      });
      $scope.unregister = () =>{
        $scope.registered = false;
        USER.logout();
      };
  }
})
