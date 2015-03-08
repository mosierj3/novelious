'use strict';

//Setting up route
angular.module('reviewers').config(['$stateProvider',
	function($stateProvider) {
		// Reviewers state routing
		$stateProvider.
		state('listReviewers', {
			url: '/reviewers',
			templateUrl: 'modules/reviewers/views/list-reviewers.client.view.html'
		}).
		state('createReviewer', {
			url: '/reviewers/create',
			templateUrl: 'modules/reviewers/views/create-reviewer.client.view.html'
		}).
		state('viewReviewer', {
			url: '/reviewers/:reviewerId',
			templateUrl: 'modules/reviewers/views/view-reviewer.client.view.html'
		}).
		state('editReviewer', {
			url: '/reviewers/:reviewerId/edit',
			templateUrl: 'modules/reviewers/views/edit-reviewer.client.view.html'
		});
	}
]);