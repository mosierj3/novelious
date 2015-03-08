'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Reviewer = mongoose.model('Reviewer'),
	_ = require('lodash');

/**
 * Create a Reviewer
 */
exports.create = function(req, res) {
	var reviewer = new Reviewer(req.body);
	reviewer.user = req.user;

	reviewer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reviewer);
		}
	});
};

/**
 * Show the current Reviewer
 */
exports.read = function(req, res) {
	res.jsonp(req.reviewer);
};

/**
 * Update a Reviewer
 */
exports.update = function(req, res) {
	var reviewer = req.reviewer ;

	reviewer = _.extend(reviewer , req.body);

	reviewer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reviewer);
		}
	});
};

/**
 * Delete an Reviewer
 */
exports.delete = function(req, res) {
	var reviewer = req.reviewer ;

	reviewer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reviewer);
		}
	});
};

/**
 * List of Reviewers
 */
exports.list = function(req, res) { 
	Reviewer.find().sort('-created').populate('user', 'displayName').exec(function(err, reviewers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reviewers);
		}
	});
};

/**
 * Reviewer middleware
 */
exports.reviewerByID = function(req, res, next, id) { 
	Reviewer.findById(id).populate('user', 'displayName').exec(function(err, reviewer) {
		if (err) return next(err);
		if (! reviewer) return next(new Error('Failed to load Reviewer ' + id));
		req.reviewer = reviewer ;
		next();
	});
};

/**
 * Reviewer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.reviewer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
