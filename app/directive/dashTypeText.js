'use strict';

angular.module('dashbenchApp')
  .directive('dashTypeText', [function () {
    return {
      templateUrl: 'dash-type-text.html',
		restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	
      	scope.$on('apiResponseJson:change', function(){

          if ('type_text' != scope.privateDash.type_indicator) return;

	      	var footer = scope.privateDash.container + '[0].' + scope.privateDash.footer_key;
      		var text = scope.privateDash.container + '[0].' + scope.privateDash.text_key;
      		var header = scope.privateDash.container + '[0].' + scope.privateDash.header_key;
      		eval('scope.text = scope.apiResponseJson.'+text+';');
	      	eval('scope.footer = scope.apiResponseJson.'+footer+';');
	      	eval('scope.header = scope.apiResponseJson.'+header+';');

	      	$('#'+scope.privateDash.id + ' .body-text').text(text);
	      	$('#'+scope.privateDash.id + ' .small').text(footer);
	      	$('#'+scope.privateDash.id + ' h1').text(header);
      	});
      }
    };
  }]);
