'use strict';

angular.module('dashbenchApp')
.directive('dashPreview', [
	'$compile',
	function ($compile) {
		return {
			templateUrl: 'dash-preview.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {

				scope.$on('show_dash', function(){
					var begin = '<section><div>',
					end = '</div></section>';

					console.log(scope.privateDash);
					// console.log(scope.apiResponseJson);

					if (!scope.privateDash.data_container || !scope.apiResponseJson || scope.apiResponseJson.length == 0) return;

					var apiResponseJson = scope.apiResponseJson[scope.privateDash.data_container][0];
					console.log(apiResponseJson)
					apiResponseJson.components = {}

					for (var j = 0; j < scope.privateDash.content_type.length; ++j) {
						apiResponseJson.components[scope.privateDash.content_type[j]] = {};
					}

					for (var j = 0; j < scope.privateDash.mapper_key.length; ++j) {
						var value = scope.privateDash.mapper_value[j];
						if (scope.privateDash.mapper_value[j].indexOf('.') != -1) {
							value = '';
							var values = scope.privateDash.mapper_value[j].split('.');
							for (var k = 0; k < values.length; ++k) {
								value += values[k];
								if (k != values.length -1) value += '.';
							}
						}
						console.log(scope.privateDash.mapper_value[j])
						console.log("apiResponseJson.components."+scope.privateDash.mapper_key[j]+
							" = apiResponseJson." + value)
						eval("apiResponseJson.components."+scope.privateDash.mapper_key[j]+
							" = apiResponseJson." + value);
					}
					for (var j = 0; j < scope.privateDash.content_type.length; ++j) {
						var component = '<' + scope.privateDash.content_type[j] +'>' + '</' + scope.privateDash.content_type[j] +'>';
						begin += component;
					}

					begin += end;

					var _scope = scope.$new();
					_scope.content = apiResponseJson;

					$('.flipsnap').append($compile(begin)(_scope));

				});
			}
		};
	}
]);
