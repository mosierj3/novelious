'use strict';

//Setting up route
angular.module('reader').config(['$stateProvider',
	function($stateProvider) {
		// Reader state routing
		$stateProvider.
		state('reader', {
			url: '/reader',
			templateUrl: 'modules/reader/views/reader.client.view.html'
		}).
		state('createReader', {
			url: '/reader/create',
			templateUrl: 'modules/reader/views/create-reader.client.view.html'
		}).
		state('viewReader', {
			url: '/reader/:readerId',
			templateUrl: 'modules/reader/views/view-reader.client.view.html'
		}).
		state('editReader', {
			url: '/reader/:readerId/edit',
			templateUrl: 'modules/reader/views/edit-reader.client.view.html'
		});
	}
]);
