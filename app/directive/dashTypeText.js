'use strict';

angular.module('dashbenchApp')
  .directive('dashTypeText', [function () {
    return {
      templateUrl: 'dash-type-text.html',
		restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	
      	scope.$on('apiResponseJson:change', function(){

	      	var footer = scope.privateDash.container + '[0].' + scope.privateDash.footer_key;
      		var text = scope.privateDash.container + '[0].' + scope.privateDash.text_key;
      		var header = scope.privateDash.container + '[0].' + scope.privateDash.header_key;
      		eval('text = scope.apiResponseJson.'+text+';');
	      	eval('footer = scope.apiResponseJson.'+footer+';');
	      	eval('header = scope.apiResponseJson.'+header+';');

	      	$('#'+scope.privateDash.id + ' .body-text').text(text);
	      	$('#'+scope.privateDash.id + ' .small').text(footer);
	      	$('#'+scope.privateDash.id + ' h1').text(header);

      	});
      }
    };
  }]);
