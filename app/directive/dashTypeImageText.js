'use strict';

angular.module('dashbenchApp')
  .directive('dashTypeImageText', [function () {
    return {
      templateUrl: 'dash-type-image-text.html',
		restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	// var container;
      	scope.$on('apiResponseJson:change', function(){
      		// container = scope.apiResponseJson[scope.privateDash.container];
	      	// scope.header = container[scope.privateDash.header_key];
	      	// scope.image = container[scope.privateDash.image_key];
	      	// scope.footer = container[scope.privateDash.footer_key];

          if ('type_image_text' != scope.privateDash.type_indicator) return;

	      	var footer = scope.privateDash.container + '[0].' + scope.privateDash.footer_key;
      		var image = scope.privateDash.container + '[0].' + scope.privateDash.image_key;
      		var header = scope.privateDash.container + '[0].' + scope.privateDash.header_key;
      		eval('scope.image = scope.apiResponseJson.'+image+';');
	      	eval('scope.footer = scope.apiResponseJson.'+footer+';');
	      	eval('scope.header = scope.apiResponseJson.'+header+';');
          
          setTimeout(function(){
  	      	$('#'+scope.privateDash.id + ' .hero').attr('src', scope.image);
  	      	$('#'+scope.privateDash.id + ' .small').text(scope.footer);
  	      	$('#'+scope.privateDash.id + ' h1').text(scope.header);
          }, 1);
      	});
      }
    };
  }]);
