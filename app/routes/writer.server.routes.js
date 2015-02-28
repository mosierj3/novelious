'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var writer = require('../../app/controllers/writer.server.controller');

	// Writer Routes
	app.route('/writer/story')
		.get(writer.listStories)
		.post(users.requiresLogin, writer.createStory);

	app.route('/writer/story/:storyId')
		.get(writer.readStory)
		.put(users.requiresLogin, writer.hasAuthorizationStory, writer.updateStory)
		.delete(users.requiresLogin, writer.hasAuthorizationStory, writer.deleteStory);

	app.route('/writer/story/:storyId/chapter')
		.get(writer.listChapters)
		.post(users.requiresLogin, writer.createChapter);

	app.route('/writer/story/:storyId/chapter/:chapterId')
		.get(writer.readChapter)
		.put(users.requiresLogin, writer.hasAuthorizationChapter, writer.updateChapter)
		.delete(users.requiresLogin, writer.hasAuthorizationChapter, writer.deleteChapter);

	// Finish by binding the Writer middleware
	app.param('storyId', writer.storyByID);
	app.param('chapterId', writer.chapterByID);
};
