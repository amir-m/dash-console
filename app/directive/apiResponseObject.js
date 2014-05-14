'use strict';

angular.module('dashbenchApp')
.directive('apiResponseObject', [function () {
	return {
		restrict: 'A',
		link: function postLink(scope, element, attrs) {
			scope.$watch('apiResponseJson', function(){
				element.text(JSON.stringify(scope.apiResponseJson, null, "\t"));
				scope.apply();
			});
		}
	};
}]);
