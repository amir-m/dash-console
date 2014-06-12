'use strict';

angular.module('dashbenchApp')
  .directive('weatherComp', [function () {
    return {
      templateUrl: '/weather-comp.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  }]);
