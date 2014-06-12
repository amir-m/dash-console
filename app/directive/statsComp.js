'use strict';

angular.module('dashbenchApp')
.directive('statsComp', [function () {
	return {
		templateUrl: '/stats-comp.html',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
		}
	};
}]);
