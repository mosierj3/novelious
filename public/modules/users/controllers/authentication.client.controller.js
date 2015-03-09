'use strict';

angular.module('users').controller('AuthenticationController', ['$timeout', '$scope', '$http', '$location', 'Authentication', 'Story', 'Menus',
	function($timeout, $scope, $http, $location, Authentication, Story, Menus) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			if($scope.credentials.invite === 'crow') {
				$http.post('/auth/signup', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;

					// And redirect to the index page
					$location.path('/');
				}).error(function(response) {
					$scope.error = response.message;
				});
			} else {
				alert('Wrong invite code.');
			}
		};

		$scope.signin = function() {

			Menus.removeMenuItem('topbar', 'writer');
			Menus.addMenuItem('topbar', 'Write', 'writer', 'dropdown', '/writer/home',null,null,1);
			Menus.addSubMenuItem('topbar', 'writer', 'New Story', 'writer/create');
			//Menus.addSubMenuDivider('topbar', 'writer');
			$timeout(function(){
				Story.query(function(response){
					angular.forEach(response, function(story){
						Menus.addSubMenuItem('topbar', 'writer', story.title, 'writer/story/' + story._id);
					});
				});
			},2000);
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
