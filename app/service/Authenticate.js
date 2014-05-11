'use strict';

angular.module('dashbenchApp')
.service('Authenticate', [
	'$rootScope',
	  '$q',
	  '$http',
	  '$location',
	function($rootScope, $q, $http, $location) {
		return function() {
            var deferred = $q.defer();

			if ($rootScope.user) {
              return $location.path('/');
            }

            $http.post('/login')
			.success(function(user){
				$rootScope.user = user;

				if (!user.confimed) return $location.path('/verify');

	            var path = $rootScope.prev || '/';
	            $rootScope.notAuthorized = null;
	            return $location.path(path);
			})
			.error(function(error){
				$rootScope.notAuthorized = true;
				deferred.resolve();
			});
            
            return deferred.promise;
		}
	}
]);