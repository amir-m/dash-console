'use strict';

angular.module('dashbenchApp')
.directive('sportsComp', [function () {
	return {
		templateUrl: '/sports-comp.html',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
			// console.log(scope.d)
		}
	};
}]);
