'use strict';

//Setting up route
angular.module('writer').config(['$stateProvider',
	function($stateProvider) {
		// Writers state routing
		$stateProvider.
		state('writer', {
			url: '',
			templateUrl: 'modules/writer/views/writer.client.view.html'
		}).
		state('writer.home', {
			url: '/writer',
			templateUrl: 'modules/writer/views/writer.home.client.view.html'
		}).
		state('writer.createStory', {
			url: '/writer/create',
			templateUrl: 'modules/writer/views/writer.createStory.client.view.html'
		}).
		state('writer.editStory', {
			url: '/writer/story/:storyId',
			templateUrl: 'modules/writer/views/writer.editStory.client.view.html'
		}).
		state('writer.createChapter', {
			url: '/writer/story/:storyId/create',
			templateUrl: 'modules/writer/views/writer.createChapter.client.view.html'
		}).
		state('writer.editChapter', {
			url: '/writer/story/:storyId/chapter/:chapterId',
			templateUrl: 'modules/writer/views/writer.editChapter.client.view.html'
		});
	}
]);
