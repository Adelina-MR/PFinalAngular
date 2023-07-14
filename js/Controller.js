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

  USER.getUsername = function(){
    return $http.get('/getUsername');
  };

  return USER;

}).config(function($routeProvider){
  $routeProvider
    .when('/', {
      controller: 'LoginController',
      templateUrl: 'Login.html'
    })
    .when('/Panel.html', {
      controller: 'PanelController',
      templateUrl: 'Panel.html'
    })
    .otherwise({
      redirectTo: '/'
    });
}).controller('LoginController', function($scope, $window,  AuthService){
  $scope.username = "";
  $scope.password = "";

  $scope.register = () => {
    console.log("Correo electrónico:", $scope.username);
    console.log("Contraseña:", $scope.password);
    
    AuthService.login($scope.username, $scope.password)
      .then(function(response){
        // Aquí se maneja la respuesta de la solicitud
        console.log("Respuesta : ", response.data); // Mostrar la respuesta en la consola
        
        if (response.data.session_id) {
          // Almacenar el session_id en el localStorage
          localStorage.setItem('session_id', response.data.session_id);
          // Redirigir a la página panel.html
          $window.location.href = '/Panel.html';
        }

      })
      .catch(function(error){
        console.error(error); // Mostrar errores en la consola
        // Resto del código para manejar los errores según sea necesario
      });
    
    // Resto del código
    $scope.username = "";
    $scope.password = "";

    return false;
  };

  $scope.unregister = () => {
    $scope.registered = false;
    AuthService.logout();
  };
}).controller('PanelController', function($scope, $window,  AuthService){
    
  // Obtener el nombre de usuario al cargar la página
  AuthService.getUsername()
    .then(function(response){
      // Aquí se maneja la respuesta de la solicitud
      console.log(response.data); // Mostrar la respuesta en la consola
      
      if (response.data.nombre) {
        // Obtener el nombre de usuario de la respuesta
        var nombreUsuario = response.data.nombre;
        // Mostrar el mensaje en la página panel.html
        $scope.mensaje = "Hola, " + nombreUsuario;
      }
    })
    .catch(function(error){
      console.error(error); // Mostrar errores en la consola
      // Resto del código para manejar los errores según sea necesario
    });

});







