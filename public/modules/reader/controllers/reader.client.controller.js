'use strict';

// Reader controller
angular.module('reader').controller('ReaderController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reader',
	function($scope, $stateParams, $location, Authentication, Reader) {
		$scope.authentication = Authentication;

		// Create new Reader
		$scope.create = function() {
			// Create new Reader object
			var reader = new Reader ({
				name: this.name
			});

			// Redirect after save
			reader.$save(function(response) {
				$location.path('reader/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Reader
		$scope.remove = function(reader) {
			if ( reader ) {
				reader.$remove();

				for (var i in $scope.reader) {
					if ($scope.reader [i] === reader) {
						$scope.reader.splice(i, 1);
					}
				}
			} else {
				$scope.reader.$remove(function() {
					$location.path('reader');
				});
			}
		};

		// Update existing Reader
		$scope.update = function() {
			var reader = $scope.reader;

			reader.$update(function() {
				$location.path('reader/' + reader._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reader
		$scope.find = function() {
			$scope.reader = Reader.query();
		};

		// Find existing Reader
		$scope.findOne = function() {
			$scope.reader = Reader.get({
				readerId: $stateParams.readerId
			});
		};
	}
]);
