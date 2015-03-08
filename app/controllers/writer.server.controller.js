'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Story = mongoose.model('Story'),
	Chapter = mongoose.model('Chapter'),
	_ = require('lodash');

/**
 * Create a Story
 */
exports.createStory = function(req, res) {
	var story = new Story(req.body);
	story.user = req.user;
	story.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(story);
		}
	});
};

/**
 * Show the current Story
 */
exports.readStory = function(req, res) {
	res.jsonp(req.story);
};

/**
 * Update a Story
 */
exports.updateStory = function(req, res) {
	var story = req.story;

	story = _.extend(story , req.body);
	story.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(story);
		}
	});
};

/**
 * Delete an Story
 */
exports.deleteStory = function(req, res) {
	var story = req.story ;

	story.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(story);
		}
	});
};

/**
 * List of Stories
 */
exports.listStories = function(req, res) {
	Story.find({'user':req.user}).sort('_id').populate('user', 'displayName').populate('chapters').exec(function(err, stories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stories);
		}
	});
};

/**
 * Story middleware
 */
exports.storyByID = function(req, res, next, id) {
	Story.findById(id).populate('user', 'displayName').populate('chapters').exec(function(err, story) {
		if (err) return next(err);
		if (! story) return next(new Error('Failed to load Story ' + id));
		req.story = story ;
		next();
	});
};

/**
 * Create a Chapter
 */
exports.createChapter = function(req, res) {
	var chapter = new Chapter(req.body);
	chapter._story = req.story._id;
	chapter.user = req.user;

	chapter.save(function(err, chapter) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			req.story.chapters.push(chapter);
			req.story.save(function(err, story) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(chapter);
				}
			});
		}
	});
};

/**
 * Show the current Chapter
 */
exports.readChapter = function(req, res) {
	res.jsonp(req.chapter);
};

/**
 * Update a Chapter
 */
exports.updateChapter = function(req, res) {
	var chapter = req.chapter ;
	chapter = _.extend(chapter , req.body);

	chapter.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chapter);
		}
	});
};

/**
 * Delete an Chapter
 */
exports.deleteChapter = function(req, res) {
	var story = req.story;
	var chapter = req.chapter ;

	// Remove the chapter document
	chapter.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove reference to chapter doc from story document
			story.chapters.pull(chapter._id);
			story.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
			});
			// Return data
			res.jsonp(chapter);
		}
	});
};

/**
 * List of Chapters
 */
exports.listChapters = function(req, res) {
	Chapter.find().sort('_id').populate('user', 'displayName').exec(function(err, chapters) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chapters);
		}
	});
};

/**
 * Chapter middleware
 */
exports.chapterByID = function(req, res, next, id) {
	Chapter.findById(id).populate('user', 'displayName').exec(function(err, chapter) {
		if (err) return next(err);
		if (! chapter) return next(new Error('Failed to load Chapter ' + id));
		req.chapter = chapter ;
		next();
	});
};

/**
 * Story authorization middleware
 */
exports.hasAuthorizationStory = function(req, res, next) {
	if (req.story.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
/**
 * Chapter authorization middleware
 */
exports.hasAuthorizationChapter = function(req, res, next) {
	if (req.chapter.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
