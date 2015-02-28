'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Writer = mongoose.model('Writer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, writer;

/**
 * Writer routes tests
 */
describe('Writer CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Writer
		user.save(function() {
			writer = {
				name: 'Writer Name'
			};

			done();
		});
	});

	it('should be able to save Writer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Writer
				agent.post('/writer')
					.send(writer)
					.expect(200)
					.end(function(writeraveErr, writeraveRes) {
						// Handle Writer save error
						if (writeraveErr) done(writeraveErr);

						// Get a list of Writer
						agent.get('/writer')
							.end(function(writerGetErr, writerGetRes) {
								// Handle Writer save error
								if (writerGetErr) done(writerGetErr);

								// Get Writer list
								var writer = writerGetRes.body;

								// Set assertions
								(writer[0].user._id).should.equal(userId);
								(writer[0].name).should.match('Writer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Writer instance if not logged in', function(done) {
		agent.post('/writer')
			.send(writer)
			.expect(401)
			.end(function(writeraveErr, writeraveRes) {
				// Call the assertion callback
				done(writeraveErr);
			});
	});

	it('should not be able to save Writer instance if no name is provided', function(done) {
		// Invalidate name field
		writer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Writer
				agent.post('/writer')
					.send(writer)
					.expect(400)
					.end(function(writeraveErr, writeraveRes) {
						// Set message assertion
						(writeraveRes.body.message).should.match('Please fill Writer name');

						// Handle Writer save error
						done(writeraveErr);
					});
			});
	});

	it('should be able to update Writer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Writer
				agent.post('/writer')
					.send(writer)
					.expect(200)
					.end(function(writeraveErr, writeraveRes) {
						// Handle Writer save error
						if (writeraveErr) done(writeraveErr);

						// Update Writer name
						writer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Writer
						agent.put('/writer/' + writeraveRes.body._id)
							.send(writer)
							.expect(200)
							.end(function(writerUpdateErr, writerUpdateRes) {
								// Handle Writer update error
								if (writerUpdateErr) done(writerUpdateErr);

								// Set assertions
								(writerUpdateRes.body._id).should.equal(writeraveRes.body._id);
								(writerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Writer if not signed in', function(done) {
		// Create new Writer model instance
		var writerObj = new Writer(writer);

		// Save the Writer
		writerObj.save(function() {
			// Request Writer
			request(app).get('/writer')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Writer if not signed in', function(done) {
		// Create new Writer model instance
		var writerObj = new Writer(writer);

		// Save the Writer
		writerObj.save(function() {
			request(app).get('/writer/' + writerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', writer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Writer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Writer
				agent.post('/writer')
					.send(writer)
					.expect(200)
					.end(function(writeraveErr, writeraveRes) {
						// Handle Writer save error
						if (writeraveErr) done(writeraveErr);

						// Delete existing Writer
						agent.delete('/writer/' + writeraveRes.body._id)
							.send(writer)
							.expect(200)
							.end(function(writerDeleteErr, writerDeleteRes) {
								// Handle Writer error error
								if (writerDeleteErr) done(writerDeleteErr);

								// Set assertions
								(writerDeleteRes.body._id).should.equal(writeraveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Writer instance if not signed in', function(done) {
		// Set Writer user
		writer.user = user;

		// Create new Writer model instance
		var writerObj = new Writer(writer);

		// Save the Writer
		writerObj.save(function() {
			// Try deleting Writer
			request(app).delete('/writer/' + writerObj._id)
			.expect(401)
			.end(function(writerDeleteErr, writerDeleteRes) {
				// Set message assertion
				(writerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Writer error error
				done(writerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Writer.remove().exec();
		done();
	});
});
