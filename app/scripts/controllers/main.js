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

		$scope.privateDash = $scope.user.dashes.length > 0 ? $scope.user.dashes[0] : {
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

		$scope.showMe = function() {

			$.ajax({
				"url": $scope.privateDash.api_end_point,
				"dataType": "jsonp",
				"crossDomain": true,
				"success": function(data, status, headers){
					// TODO: check headers.status
					// console.log(headers.status)
					$scope.apiResponseJson = data;
					getKeys();
					$scope.apply();
				}
			});
		};

		function getKeys() {

			if ($scope.privateDash.main_img && ($scope.privateDash.type_indicator == 'type_image' 
				|| $scope.privateDash.type_indicator == 'type_image_text')) {

				var tmp = $scope.privateDash.main_img.split('.');
				$scope.privateDash.image_key = tmp[ tmp.length - 1 ];
				tmp.splice( tmp.length - 1, 1 );
				// tmp = tmp.join('.');
				$scope.privateDash.container = tmp;
			}

			if ($scope.privateDash.header && ($scope.privateDash.type_indicator == 'type_text' 
				|| $scope.privateDash.type_indicator == 'type_image_text')) {
				
				tmp = $scope.privateDash.header.split('.');
				$scope.privateDash.header_key = tmp[ tmp.length - 1 ];
				tmp.splice( tmp.length - 1, 1 );
				// tmp = tmp.join('.');
				$scope.privateDash.container = tmp;
			}

			if ($scope.privateDash.text && $scope.privateDash.type_indicator == 'type_text') {
				
				tmp = $scope.privateDash.text.split('.');
				$scope.privateDash.text_key = tmp[ tmp.length - 1 ];
				tmp.splice( tmp.length - 1, 1 );
				// tmp = tmp.join('.');
				$scope.privateDash.container = tmp;
			}

			if ($scope.privateDash.footer) {
				tmp = $scope.privateDash.footer.split('.');
				$scope.privateDash.footer_key = tmp[ tmp.length - 1 ];
				tmp.splice( tmp.length - 1, 1 );
				// tmp = tmp.join('.');
				$scope.privateDash.container = tmp;
			}
			$scope.$broadcast('apiResponseJson:change');
		}

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
