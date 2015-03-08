'use strict';

//Setting up route
angular.module('writer').config(['$stateProvider',
	function($stateProvider) {
		// Writers state routing
		$stateProvider.
		state('writer', {
			abstract: true,
			url: '/writer',
			templateUrl: 'modules/writer/views/writer.client.view.html'
		}).
		state('writer.home', {
			url: '/home',
			templateUrl: 'modules/writer/views/writer.home.client.view.html'
		}).
		state('writer.createStory', {
			url: '/create',
			templateUrl: 'modules/writer/views/writer.edit.client.view.html'
		}).
		state('writer.edit', {
			url: '/story/:storyId',
			templateUrl: 'modules/writer/views/writer.edit.client.view.html'
		}).
		state('writer.editChapter', {
			url: '/story/:storyId/chapter/:chapterId',
			templateUrl: 'modules/writer/views/writer.edit.client.view.html'
		});
	}
]);
