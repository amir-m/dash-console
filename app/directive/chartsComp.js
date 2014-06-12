'use strict';

angular.module('dashbenchApp')
  .directive('chartsComp', [function () {
    return {
      templateUrl: '/charts-comp.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  }]);
