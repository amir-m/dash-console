'use strict';

angular.module('dashbenchApp')
  .directive('dashTypeImage', [function () {
    return {
      templateUrl: 'dash-type-image.html',
		restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  }]);
