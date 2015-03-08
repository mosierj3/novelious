'use strict';

//Reader service used to communicate Reader REST endpoints
angular.module('reader').factory('Reader', ['$resource',
	function($resource) {
		return $resource('reader/:readerId', { readerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
