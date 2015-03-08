'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var reviewers = require('../../app/controllers/reviewers.server.controller');

	// Reviewers Routes
	app.route('/reviewers')
		.get(reviewers.list)
		.post(users.requiresLogin, reviewers.create);

	app.route('/reviewers/:reviewerId')
		.get(reviewers.read)
		.put(users.requiresLogin, reviewers.hasAuthorization, reviewers.update)
		.delete(users.requiresLogin, reviewers.hasAuthorization, reviewers.delete);

	// Finish by binding the Reviewer middleware
	app.param('reviewerId', reviewers.reviewerByID);
};
