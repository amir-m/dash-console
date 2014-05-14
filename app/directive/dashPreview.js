'use strict';

angular.module('dashbenchApp')
.directive('dashPreview', [function () {
	return {
		templateUrl: 'dash-preview.html',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {

		}
	};
}]);
