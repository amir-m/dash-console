'use strict';

angular.module('dashbenchApp', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          check: [
          '$rootScope',
          '$location',
          function($rootScope, $location) {

            if (!$rootScope.user) 
              return $location.path('/login');

            if (!$rootScope.user.confirmed) 
              return $location.path('/verify');

          }]
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        resolve: {
          check: [
          '$rootScope',
          '$location',
          'Authenticate',
          function($rootScope, $location, Authenticate, $http) {

            return Authenticate();

          }]
        }
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          check: [
          '$rootScope',
          '$location',
          'Authenticate',
          function($rootScope, $location, Authenticate, $http) {

            return Authenticate();

          }]
        }
      })
      .when('/verify', {
        templateUrl: 'views/verify.html',
        controller: 'VerifyCtrl',
        resolve: {
          check: [
          '$rootScope',
          '$location',
          'Authenticate',
          function($rootScope, $location, Authenticate, $http) {

            if (!$rootScope.user) 
              return $location.path('/login');

            if ($rootScope.user.confirmed) 
              return $location.path('/');

          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
