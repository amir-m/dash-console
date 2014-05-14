'use strict';

angular.module('dashbenchApp')
  .directive('dashTypeText', [function () {
    return {
      templateUrl: 'dash-type-text.html',
		restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  }]);
