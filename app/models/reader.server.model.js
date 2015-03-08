'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Reader Schema
 */
var ReaderSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Reader name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Reader', ReaderSchema);