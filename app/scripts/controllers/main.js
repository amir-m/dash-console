'use strict';

angular.module('dashbenchApp')
.controller('MainCtrl', [
	'$scope',
	'$http',
	'$location',
	'$rootScope',
	function ($scope, $http, $location, $rootScope) {
		
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

		$scope.getApi = function() {

			$.ajax({
				"url": $scope.apiEndPoint,
				"dataType": "jsonp",
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
			$scope.privateDash.api_end_point = $scope.apiEndPoint ? $scope.apiEndPoint : $scope.privateDash.api_end_point;
			getKeys();
			$scope.apply();
		};

		$scope.submit = function() {
			if (!$scope.submitPressed) {
				return $scope.submitPressed = true;
			}
			
			$('.modal-view').hide();

			$scope.privateDash.created_at = new Date();

			$http.put('/dash', angular.toJson($scope.privateDash))
			.success(function(){
				$scope.user.private_dashes_left--;
				$scope.submitPressed = false;
			})
			.error(function(){
				// TODO: Handle error
			});
		};

		$scope.showMe = function(dash) {
			
			$scope.privateDash = dash;
			$.ajax({
				"url": 'http://requestor-env.elasticbeanstalk.com/call?'+dash.api_end_point,
				"dataType": "json",
				"crossDomain": true,
				"success": function(data, status, headers){
					// TODO: check headers.status
					// console.log(headers.status)
					$scope.apiResponseJson = data;
					getKeys(data);
					// console.log(data);
					$scope.apply();
				}, 
				"error": function(error) {
					throw error;
				}
			});
			// $.ajax({
			// 	"url": $scope.privateDash.api_end_point,
			// 	"crossDomain": true,
			// 	"success": function(data, status, headers){
			// 		// TODO: check headers.status
			// 		// console.log(headers.status)
			// 		// $scope.apiResponseJson = data;
			// 		getKeys();
			// 		$scope.apply();
			// 	}
			// });
		};

		function getKeys() {

			if ($scope.privateDash.main_img && ($scope.privateDash.type_indicator == 'type_image' 
				|| $scope.privateDash.type_indicator == 'type_image_text')) {

				$scope.privateDash.image_key = $scope.privateDash.main_img;
			}

			if ($scope.privateDash.header && ($scope.privateDash.type_indicator == 'type_text' 
				|| $scope.privateDash.type_indicator == 'type_image_text')) {
				
				$scope.privateDash.header_key = $scope.privateDash.header;
			}

			if ($scope.privateDash.text && $scope.privateDash.type_indicator == 'type_text') {
				
				$scope.privateDash.text_key = $scope.privateDash.text;
			}

			if ($scope.privateDash.footer) {
				$scope.privateDash.footer_key = $scope.privateDash.footer;
			}
			console.log($scope.privateDash);
			$scope.apply();
			$scope.$broadcast('apiResponseJson:change');
		}

		$scope.logout = function() {
			$http.post('/logout')
			.success(function(){
				$rootScope.user = null;
				$location.path('/login');
			})
			.error(function(){
				throw error;
			})
		};

		$(".temps a").click(function(e){
			e.preventDefault();
			$(".temps a").removeClass("selected");
			$(this).addClass("selected");
		});

		$(".test button, .control .no-btn, .show-modal").click(function(){
			$(".modal-view").toggle();
		});
	}
]);
