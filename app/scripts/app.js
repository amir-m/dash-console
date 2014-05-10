'use strict';

angular.module('dashbenchApp', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        resolve: {
          check: [
          '$rootScope',
          '$location',
          'Authenticate',
          // '$http',
          function($rootScope, $location, Authenticate, $http) {
            
            var path = $rootScope.prev || '/feed';

            // $('html').css('background-color', '#df4a29');

            if ($rootScope.user) {
              return $location.path(path);
            }
            
            return Authenticate();
            
            // var deffered = $q.defer();

            $http.post('/login')
            .success(function(data){
              $rootScope.user = data;
              // if (path == '/') path = '/feeds';
              $location.path(path);

              // $location.path(path);
            })
            .error(function(error){
              // $location.path('/');
              // $rootScope.authenticated = false;
            });

          }]
        }
      })
      .when('/signup', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
