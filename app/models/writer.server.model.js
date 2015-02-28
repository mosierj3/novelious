'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Story Schema
 */
var StorySchema = new mongoose.Schema({
	title: String,
	author: String,
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
	user: { type: Schema.ObjectId, ref: 'User' }
});

/**
 * Chapter Schema
 */
var ChapterSchema = new mongoose.Schema({
	_story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
	number: Number,
  title: String,
  text: String,
	user: { type: Schema.ObjectId, ref: 'User' }
});

mongoose.model('Chapter', ChapterSchema);
mongoose.model('Story', StorySchema);
