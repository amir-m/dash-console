'use strict';

angular.module('dashbenchApp')
.controller('MainCtrl', [
	'$scope',
	'$http',
	'$location',
	'$rootScope',
	'$q',
	function ($scope, $http, $location, $rootScope, $q) {
		
		$scope.dash_specs = false;
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
			source_uri: '',
			source_return_type: 'json'
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
				source_uri: '',
				source_return_type: 'json'
			};

			$scope.apiResponseJson = null;
			$scope.dash_specs = true;
			$scope.started = false;
			$rootScope.apply();
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

		$scope.getApiPromise = function() {
			if ($scope.privateDash.source_uri_keys && $scope.privateDash.source_uri_keys.length > 0) {
				if ($scope.privateDash.source_uri_keys.indexOf('{latitude}') != -1) {
					$scope.privateDash.source_uri = $scope.privateDash.source_uri.replace('{latitude}', scope.latitude);
				}
				if ($scope.privateDash.source_uri_keys.indexOf('{longitude}') != -1) {
					$scope.privateDash.source_uri = $scope.privateDash.source_uri.replace('{longitude}', scope.longitude);
				}
				if ($scope.privateDash.source_uri_keys.indexOf('{selected_setting}') != -1) {
					$scope.privateDash.source_uri = $scope.privateDash.source_uri.replace('{selected_setting}', $scope.privateDash.selected_setting);
				}
				for (var i = 0; i < $scope.privateDash.source_uri_keys.length; ++i) {
					if ($scope.privateDash.source_uri_keys[i] != '{latitude}' && $scope.privateDash.source_uri_keys[i] != '{longitude}' && $scope.privateDash.source_uri_keys[i] != '{selected_setting}')
						$scope.privateDash.source_uri = $scope.privateDash.source_uri.replace($scope.privateDash.source_uri_keys[i], $scope.privateDash.source_uri_values[i]);
				}
			};
			var deferred = $q.defer();
			$(".spinner").show();
			$http.get('http://requestor-env.elasticbeanstalk.com/call?' + $scope.privateDash.source_uri)
			.success(function(data, status, headers){
				// TODO: check headers.status
				$(".spinner").hide();
				$scope.apiResponseJson = data;
				$scope.apply();
				deferred.resolve();
			})
			.error(function(error){
				// TODO: Handle error
				deferred.reject(error);
			});
			return deferred.promise;
		};

		$scope.tryIt = function(isJson) {
			// $(".spinner").show();
			// $scope.privateDash.source_uri = $scope.privateDash.source_uri;
			// $scope.privateDash.api_end_point = $scope.apiEndPoint ? $scope.apiEndPoint : $scope.privateDash.api_end_point;
			if (isJson) {
				try{
					$scope.privateDash = JSON.parse($scope.json);
				}
				catch(e) {
					// TODO: Inform user....
					throw e;
				}
				var p = $scope.getApiPromise();
				p.then(function(){
					getJsonKeys();
				}, function(error){ throw error; });
			}
			else
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

		function getJsonKeys() {
			$scope.$broadcast('show_dash');
			$(".modal-view").toggle();
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

			console.log($scope.privateDash)

			$scope.$broadcast('show_dash');
			$(".modal-view").toggle();
		};

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

		$scope.showHide = function(showMe, hideMe) {
			$('#' + hideMe).hide();
			$('#' + showMe).show();
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

// {
// 	"content_type": ["src_comp", "hero_comp", "footer_comp"],
// 	"source_return_type": "xml",
// 	"dash_title": "TechCrunch",
// 	"dash_type": "image",
// 	"data_container": "data['rss']['channel'][0]['item']",
// 	"has_settings": false,
// 	"mapper_key": ["src_comp.resource_uri", "hero_comp.main_img", "footer_comp.footer"],
// 	"mapper_value": ["['link']", "['media:content'][0]['$']['url']", "['title'][0]"],
// 	"source_uri": "http://engine-env.elasticbeanstalk.com/rss/call?http://techcrunch.com/feed/",
// 	"components_settings": {}
// }

// {
// 	"id": "NTI5NjM5ZTlmOGZjY2Q1ODliMDAwMDAx",
// 	"title": "Coffee Near Me",
// 	"source_return_type": "json",
// 	"source_uri": "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&rankBy=distance&radius=4000&keyword={keyword}&sensor=true&key={api_key}",
// 	"source_uri_keys": "{latitude}:{longitude}:{keyword}:{api_key}",
// 	"source_uri_values": "latitude:longitude:coffee:AIzaSyAfzGESbROgOjoOqJrMbtIKNRtebL3w0Lc",
// 	"content_type": "src_comp:geo_comp",
// 	"setting_type": "n/a",
// 	"description": "Find the closest cup of coffee based on your current location",
// 	"credits": "Google Places",
// 	"icon_large": "https://s3.amazonaws.com/s3.dashbook.co/dash_icons/coffee_large_icon.png",
// 	"icon_small": "https://s3.amazonaws.com/s3.dashbook.co/dash_icons/coffee_small_icon.png",
// 	"settings": "coffee",
// 	"data_container": "results",
// 	"mapper_key": "geo_comp.header:geo_comp.text:geo_comp.latitude:geo_comp.longitude",
// 	"mapper_value": "name:vicinity:geometry.location.lat:geometry.location.lng",
// 	"has_settings": "false"
// },

// {
// 	"source_uri": "https://api.instagram.com/v1/media/search?lat={latitude}&lng={longitude}&distance=5000&client_id={client_id}",
// 	"source_uri_keys": [ "{latitude}", "{longitude}", "{client_id}"],
// 	"source_uri_values": ["latitude", "longitude", "279a55cf0c324a83b90d36c29bf503ff"],
// 	"source_return_type": "json",
// 	"content_type": [ "src_comp", "geo_comp", "hero_comp" ],
// 	"dash_title": "PhotosAroundMe",
// 	"setting_type": "",
// 	"location": "",
// 	"settings": "",
// 	"data_container": "data",
// 	"mapper_key": ["geo_comp.header", "geo_comp.latitude", "geo_comp.longitude", "hero_comp.main_img"],
// 	"mapper_value": ["user.full_name", "location.latitude", "location.longitude", "images.standard_resolution.url"],
// 	"has_settings": "false"
// }
// 	"components_settings": {
// 		"hero_comp": {
// 			"class": ["banner-square"]
// 		}
// 	}

// {
// 	"dash_type": "image",
// 	"dash_title": "DribbbleTest",
// 	"source_return_type": "json",
// 	"source_uri": ["https://api.dribbble.com/shots/popular?per_page=30", "https://api.dribbble.com/shots/debuts?per_page=30", "https://api.dribbble.com/shots/everyone?per_page=30"],
// 	"content_type": ["src_comp", "hero_comp", "desc_comp", "footer_comp"],
// 	"setting_type": "radio",
// 	"selected_setting": "Popular",
// 	"settings": ["Popular", "Debut", "Everyone"],
// 	"data_container": "shots",
// 	"mapper_key": ["src_comp.resource_uri", "desc_comp.header", "desc_comp.text", "desc_comp.avatar_img", "hero_comp.main_img", "footer_comp.time"],
// 	"mapper_value": ["url", "player.name", "title", "player.avatar_url", "image_url", "created_at"],
// 	"has_settings": "true"
// },