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
}).controller('LoginController', function($scope, $location, AuthService){
  $scope.username = "";
  $scope.password = "";

  $scope.register = () => {
    console.log("Correo electrónico:", $scope.username);
    console.log("Contraseña:", $scope.password);
    
    AuthService.login($scope.username, $scope.password)
      .then(function(response){
        // Aquí se maneja la respuesta de la solicitud
        console.log(response.data); // Mostrar la respuesta en la consola
        
        if (response.data.session_id) {
          // Redirigir a la página index2.html
          $location.path('/index2.html');
        }

      })
      .catch(function(error){
        console.error(error); // Mostrar errores en la consola
        // Resto del código para manejar los errores según sea necesario
      });
    
    // Resto del código
    $scope.username = "";
    $scope.password = "";
  };

  $scope.unregister = () => {
    $scope.registered = false;
    AuthService.logout();
  };
});







