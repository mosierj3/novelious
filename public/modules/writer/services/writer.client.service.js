'use strict';

//Story service used to communicate Story REST endpoints
angular.module('writer').factory('Story', ['$resource',
	function($resource) {
		return $resource('writer/story/:storyId', { storyId: '@_storyId'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Chapter service used to communicate Chapter REST endpoints
angular.module('writer').factory('Chapter', ['$resource',
	function($resource) {
		return $resource('writer/story/:storyId/chapter/:chapterId', { storyId: '@_storyId', chapterId: '@_chapterId'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
