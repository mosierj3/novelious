'use strict';

//Setting up route
angular.module('writer').config(['$stateProvider',
	function($stateProvider) {
		// Writers state routing
		$stateProvider.
		state('writer', {
			url: '/writer',
			templateUrl: 'modules/writer/views/writer.client.view.html'
		}).
		state('writer.home', {
			url: '/home',
			templateUrl: 'modules/writer/views/writer.home.client.view.html'
		}).
		state('writer.createStory', {
			url: '/create',
			templateUrl: 'modules/writer/views/writer.createStory.client.view.html'
		}).
		state('writer.editStory', {
			url: '/story/:storyId',
			templateUrl: 'modules/writer/views/writer.editStory.client.view.html'
		}).
		state('writer.createChapter', {
			url: '/story/:storyId/create',
			templateUrl: 'modules/writer/views/writer.createChapter.client.view.html'
		}).
		state('writer.editChapter', {
			url: '/story/:storyId/chapter/:chapterId',
			templateUrl: 'modules/writer/views/writer.editChapter.client.view.html'
		});
	}
]);
