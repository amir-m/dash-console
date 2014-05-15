'use strict';

angular.module('dashbenchApp')
.directive('checkDashUniqueName', [
	'$http',
	function ($http) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				element.bind('keyup', function(e){
					e.preventDefault();

					var path = '/dashname/exist/' + scope.privateDash.dash_title;

					$http.get(path)
					.success(function(){
						element.addClass('good-input');
					})
					.error(function(error, code){
						if (code == 409) element.addClass('bad-input');
						else throw error;
					});
				});
			}
		};
	}
]);
