'use strict';

angular.module('dashbenchApp')
  .directive('dashTypeImageText', [function () {
    return {
      templateUrl: 'dash-type-image-text.html',
		restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  }]);
