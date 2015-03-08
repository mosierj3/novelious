'use strict';

//Reviewers service used to communicate Reviewers REST endpoints
angular.module('reviewers').factory('Reviewers', ['$resource',
	function($resource) {
		return $resource('reviewers/:reviewerId', { reviewerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);