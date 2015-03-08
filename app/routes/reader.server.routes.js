'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var reader = require('../../app/controllers/reader.server.controller');

	// Readers Routes
	app.route('/reader')
		.get(reader.list)
		.post(users.requiresLogin, reader.create);

	app.route('/reader/:readerId')
		.get(reader.read)
		.put(users.requiresLogin, reader.hasAuthorization, reader.update)
		.delete(users.requiresLogin, reader.hasAuthorization, reader.delete);

	// Finish by binding the Reader middleware
	app.param('readerId', reader.readerByID);
};
