'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Reader = mongoose.model('Reader'),
	_ = require('lodash');

/**
 * Create a Reader
 */
exports.create = function(req, res) {
	var reader = new Reader(req.body);
	reader.user = req.user;

	reader.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reader);
		}
	});
};

/**
 * Show the current Reader
 */
exports.read = function(req, res) {
	res.jsonp(req.reader);
};

/**
 * Update a Reader
 */
exports.update = function(req, res) {
	var reader = req.reader ;

	reader = _.extend(reader , req.body);

	reader.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reader);
		}
	});
};

/**
 * Delete an Reader
 */
exports.delete = function(req, res) {
	var reader = req.reader ;

	reader.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reader);
		}
	});
};

/**
 * List of Readers
 */
exports.list = function(req, res) {
	Reader.find().sort('-created').populate('user', 'displayName').exec(function(err, readers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(readers);
		}
	});
};

/**
 * Reader middleware
 */
exports.readerByID = function(req, res, next, id) {
	Reader.findById(id).populate('user', 'displayName').exec(function(err, reader) {
		if (err) return next(err);
		if (! reader) return next(new Error('Failed to load Reader ' + id));
		req.reader = reader ;
		next();
	});
};

/**
 * Reader authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.reader.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
