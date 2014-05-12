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
            
            var path = $rootScope.prev || '/';
            if (path == '/login' || path == '/signup') path = '/';

			if ($rootScope.user) {
              return $location.path(path);
            }

            $http.post('/login')
			.success(function(user){
				$rootScope.user = user;

				if (!user.confimed) return $location.path('/verify');

	            return $location.path(path);
			})
			.error(function(error){
				deferred.resolve();
			});
            
            return deferred.promise;
		}
	}
]);