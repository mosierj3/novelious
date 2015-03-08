'use strict';

// Reviewers controller
angular.module('reviewers').controller('ReviewersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reviewers',
	function($scope, $stateParams, $location, Authentication, Reviewers) {
		$scope.authentication = Authentication;

		// Create new Reviewer
		$scope.create = function() {
			// Create new Reviewer object
			var reviewer = new Reviewers ({
				name: this.name
			});

			// Redirect after save
			reviewer.$save(function(response) {
				$location.path('reviewers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Reviewer
		$scope.remove = function(reviewer) {
			if ( reviewer ) { 
				reviewer.$remove();

				for (var i in $scope.reviewers) {
					if ($scope.reviewers [i] === reviewer) {
						$scope.reviewers.splice(i, 1);
					}
				}
			} else {
				$scope.reviewer.$remove(function() {
					$location.path('reviewers');
				});
			}
		};

		// Update existing Reviewer
		$scope.update = function() {
			var reviewer = $scope.reviewer;

			reviewer.$update(function() {
				$location.path('reviewers/' + reviewer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reviewers
		$scope.find = function() {
			$scope.reviewers = Reviewers.query();
		};

		// Find existing Reviewer
		$scope.findOne = function() {
			$scope.reviewer = Reviewers.get({ 
				reviewerId: $stateParams.reviewerId
			});
		};
	}
]);