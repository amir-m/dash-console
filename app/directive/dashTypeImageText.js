'use strict';

angular.module('dashbenchApp')
  .directive('dashTypeImageText', [function () {
    return {
      templateUrl: 'dash-type-image-text.html',
		restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	var container;
      	scope.$on('apiResponseJson:change', function(){
      		container = scope.apiResponseJson;
	      	if (Object.prototype.toString.call(scope.privateDash.container) == '[object Array]') {
	      		for (var i = 0; i < scope.privateDash.container.length; ++i) {
	      			container = container[scope.privateDash.container[i]];
	      		}
	      	}
	      	else {
	      		container = scope.privateDash.container;
	      	}
	      	if (!container) return;
	      	scope.header = container[0][scope.privateDash.header_key];
	      	scope.image = container[0][scope.privateDash.image_key];
	      	scope.footer = container[0][scope.privateDash.footer_key];
      	});
      }
    };
  }]);