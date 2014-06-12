'use strict';

angular.module('dashbenchApp')
.directive('footerComp', ['$timeout',
	function ($timeout) {
	return {
		templateUrl: '/footer-comp.html',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {

	      	scope.$on('suicide', function(){
	      
	      		$(element).parent().parent('section').remove();
				$timeout(function(){
	      			scope.$destroy();
      			});
			});	
		}
	};
}]);
