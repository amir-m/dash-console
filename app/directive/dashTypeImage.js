'use strict';

angular.module('dashbenchApp')
  .directive('dashTypeImage', [function () {
    return {
      templateUrl: 'dash-type-image.html',
		restrict: 'E',
      link: function postLink(scope, element, attrs) {      

      	scope.$on('apiResponseJson:change', function(){
      		var footer = scope.privateDash.container + '[0].' + scope.privateDash.footer_key;
      		var image = scope.privateDash.container + '[0].' + scope.privateDash.image_key;
      		eval('image = scope.apiResponseJson.'+image+';');
	      	eval('footer = scope.apiResponseJson.'+footer+';');

	      	$('#'+scope.privateDash.id + ' .hero').attr('src', image);
	      	$('#'+scope.privateDash.id + ' .small').text(footer);
      	});
      }
    };
  }]);
