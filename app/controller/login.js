'use strict';

angular.module('dashbenchApp')
.controller('LoginCtrl', [
	'$scope',
	'$rootScope',
	'$location',
	'$http',
	function ($scope, $rootScope, $location, $http) {

		$scope.login = function() {
			$http.post('/login', {
				email: $scope.email,
				password: $scope.password
			})
			.success(function(user){
				$rootScope.user = user;
				$location.path('/');
			})
			.error(function(error){
				throw error;
			});
		}
	}
]);
