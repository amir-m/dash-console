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
			data: [
				{
					key: "value",
					another_key: "another_value"
				}
			]
		};

		$scope.hero_comp = {
			main_img: ''
		};

		$scope.desc_comp = {
			header: '',
			text: ''
		};

		$scope.src_comp = {
			resource_uri: ''
		};

		$scope.footer_comp = {
			footer: ''
		};
	
		$scope.privateDash = {
			dash_type: 'text',
			content_type: ['src_comp', 'desc_comp', 'footer_comp'],
			has_settings: false,
			mapper_key: ['src_comp.resource_uri', 'desc_comp.header', 'desc_comp.text', 'footer_comp.footer'],
			mapper_value: ['resource_uri'],
			source_uri: ''
		};

		$scope.start = function() {
			$scope.started = true;
					$scope.hero_comp = {
				main_img: ''
			};

			$scope.desc_comp = {
				header: '',
				text: ''
			};

			$scope.src_comp = {
				resource_uri: ''
			};

			$scope.footer_comp = {
				footer: ''
			};
		
			$scope.privateDash = {
				dash_type: 'text',
				content_type: ['src_comp', 'desc_comp', 'footer_comp'],
				has_settings: false,
				mapper_key: ['src_comp.resource_uri', 'desc_comp.header', 'desc_comp.text', 'footer_comp.footer'],
				mapper_value: ['resource_uri'],
				source_uri: ''
			};

			$scope.apiResponseJson = null;
		};

		$scope.setPrivateType = function(type) {

			
			$scope.privateDash['dash_type'] = type;

			if (type == 'image') {
				$scope.privateDash['content_type'] = ['src_comp', 'hero_comp', 'footer_comp'];
				$scope.privateDash.mapper_key = ['src_comp.resource_uri', 'hero_comp.main_img', 'footer_comp.footer'];
			}
			else {
				$scope.privateDash['content_type'] = ['src_comp', 'desc_comp', 'footer_comp'];
				$scope.privateDash.mapper_key = ['src_comp.resource_uri', 'desc_comp.header', 'desc_comp.text', 'footer_comp.footer'];
			}
		};

		$scope.getApi = function() {
			$(".spinner").show();
			$http.get('http://requestor-env.elasticbeanstalk.com/call?' + $scope.privateDash.source_uri)
			.success(function(data, status, headers){
				// TODO: check headers.status
				$(".spinner").hide();
				$scope.apiResponseJson = data;

				$scope.apply();
			})
			.error(function(){
				// TODO: Handle error
			});
		};

		$scope.tryIt = function() {
			// $(".spinner").show();
			$scope.privateDash.source_uri = $scope.privateDash.source_uri;
			// $scope.privateDash.api_end_point = $scope.apiEndPoint ? $scope.apiEndPoint : $scope.privateDash.api_end_point;
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
			.success(function(dash){
				console.log(dash)
				$scope.user.dashes.push(dash);
				$scope.user.private_dashes_left--;
				$scope.submitPressed = false;
			})
			.error(function(){
				// TODO: Handle error
			});
		};

		$scope.showMe = function(dash) {
			$(".spinner").show();
			$scope.privateDash = dash;
			for (var i = 0; i < $scope.privateDash.mapper_key.length; ++i) {
				var key = $scope.privateDash.mapper_key[i].split('.')[0];
				var value = $scope.privateDash.mapper_key[i].split('.')[1];
				$scope[key][value] = $scope.privateDash.mapper_value[i];
			}
			$http.get('http://requestor-env.elasticbeanstalk.com/call?'+dash.source_uri)
			.success(function(data, status, headers){
				// TODO: check headers.status
				// console.log(headers.status)
				$scope.apiResponseJson = data;
				getKeys(data);
				// console.log(data);
				$scope.apply();
				$(".spinner").hide();
			})
			.error(function(error) {
				throw error;
			});
		};

		function getKeys() {

			$scope.privateDash.mapper_value = [$scope.src_comp.resource_uri];

			if ($scope.privateDash.dash_type == 'image') {			
				$scope.privateDash.mapper_value.push($scope.hero_comp.main_img);
			}
			else {
				$scope.privateDash.mapper_value.push($scope.desc_comp.header); 
				$scope.privateDash.mapper_value.push($scope.desc_comp.text);
			}

			$scope.privateDash.mapper_value.push($scope.footer_comp.footer);

			$scope.apply();
			if (!$scope.privateDash.id) $scope.privateDash.id = '_private_dash_id';
			$scope.$broadcast('show_dash');
			$(".modal-view").toggle();
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

		$scope.dismissModal = function() {
			$(".spinner").hide();
			$(".modal-view").hide();
		};

		$(".temps a").click(function(e){
			e.preventDefault();
			$(".temps a").removeClass("selected");
			$(this).addClass("selected");
		});

		$scope.$watch('apiResponseJson', function(){
			$scope.$broadcast('apiResponseJson:change');
		});

		// $(".test button, .control .no-btn, .show-modal").click(function(){
		// 	$(".modal-view").toggle();
		// });
	}
]);
