'use strict';

angular.module('dashbenchApp')
.controller('SignupCtrl', [
	'$scope',
	'$http',
	'$rootScope',
	'$location',
	function ($scope, $http, $rootScope, $location) {
		
		$scope.signup = function() {

			if (!$scope.emailAddress || !$scope.password || !$scope.name) return;

			$http.put('/user', {
				name: $scope.name,
				email: $scope.emailAddress,
				password: $scope.password
			})
			.success(function(user){
				$rootScope.user = user;
				return $location.path('/verify');
			})
			.error(function(error){
				if (error == 409)
					console.log('conflict...');
				console.log(error);
			})
		}
	}
]);
