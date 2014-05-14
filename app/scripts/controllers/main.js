'use strict';

angular.module('dashbenchApp')
.controller('MainCtrl', [
	'$scope',
	'$http',
	function ($scope, $http) {
		
		$scope.started = false;
		$scope.submitPressed = false;
		$scope.apiResponseJson = {
			key: "value",
			another_key: "another_value"
		};

		$scope.privateDash = {
			dash_type: 'text',
			type_indicator: 'type_text'
		};

		$scope.start = function() {
			$scope.started = true;
		};


		$scope.setPrivateType = function(type, id) {
			$scope.privateDash['dash_type'] = type;
			$scope.privateDash['type_indicator'] = id;
		};

		$scope.submit = function() {
			if (!$scope.submitPressed) {
				return $scope.submitPressed = true;
			}
			// TODO: submit functionality using an http request, $scope.submitPressed = false
		};

		$scope.getApi = function() {

			$.ajax({
				"url": $scope.apiEndPoint,
				"dataType": "jsonp",
				"host": "api.dribbble.com",
				"crossDomain": true,
				"success": function(data, status, headers){
					// TODO: check headers.status
					// console.log(headers.status)
					$scope.apiResponseJson = data;
					$scope.apply();
				}
			});
		};

		$scope.tryIt = function() {

			if ($scope.privateDash.type_indicator == 'type_image' 
				|| $scope.privateDash.type_indicator == 'type_image_text') {

				var tmp = $scope.privateDash.main_img.split('.');
				$scope.privateDash.container = tmp[0];
				$scope.privateDash.main_image_key = tmp[1];
				
			}

			if ($scope.privateDash.type_indicator == 'type_text' 
				|| $scope.privateDash.type_indicator == 'type_image_text') {
				
				tmp = $scope.privateDash.header.split('.');
				$scope.privateDash.container = tmp[0];
				$scope.privateDash.header_key = tmp[1];
			}

			if ($scope.privateDash.type_indicator == 'type_text') {
				
				tmp = $scope.privateDash.text.split('.');
				$scope.privateDash.container = tmp[0];
				$scope.privateDash.text_key = tmp[1];
			}


			tmp = $scope.privateDash.footer.split('.');
			$scope.privateDash.container = tmp[0];
			$scope.privateDash.footer_key = tmp[1];

		};

		$(".temps a").click(function(e){
			e.preventDefault();
			$(".temps a").removeClass("selected");
			$(this).addClass("selected");
		});

		$(".test button, .control .no-btn").click(function(){
			$(".modal-view").toggle();
		});

	}
]);
