'use strict';

angular.module('dashbenchApp')
  .directive('dashTypeImage', [function () {
    return {
      templateUrl: 'dash-type-image.html',
		restrict: 'E',
      link: function postLink(scope, element, attrs) {      

      	scope.$on('apiResponseJson:change', function(){

          if ('type_image' != scope.privateDash.type_indicator) return;
          
      		var footer = scope.privateDash.container + '[0].' + scope.privateDash.footer_key;
      		var _image = scope.privateDash.container + '[0].' + scope.privateDash.image_key;
      		eval('scope.image = scope.apiResponseJson.'+_image+';');
	      	eval('scope.footer = scope.apiResponseJson.'+footer+';');
          setTimeout(function(){
            $('#'+scope.privateDash.id + ' .hero').attr('src', scope.image);
            $('#'+scope.privateDash.id + ' .small').text(scope.footer);
            console.log(scope.footer, scope.image)
            // scope.apply();
          }, 1);
      	});
      }
    };
  }]);
