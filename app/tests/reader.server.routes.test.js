'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Reader = mongoose.model('Reader'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, reader;

/**
 * Reader routes tests
 */
describe('Reader CRUD tests', function() {
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

		// Save a user to the test db and create new Reader
		user.save(function() {
			reader = {
				name: 'Reader Name'
			};

			done();
		});
	});

	it('should be able to save Reader instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reader
				agent.post('/readers')
					.send(reader)
					.expect(200)
					.end(function(readerSaveErr, readerSaveRes) {
						// Handle Reader save error
						if (readerSaveErr) done(readerSaveErr);

						// Get a list of Readers
						agent.get('/readers')
							.end(function(readersGetErr, readersGetRes) {
								// Handle Reader save error
								if (readersGetErr) done(readersGetErr);

								// Get Readers list
								var readers = readersGetRes.body;

								// Set assertions
								(readers[0].user._id).should.equal(userId);
								(readers[0].name).should.match('Reader Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Reader instance if not logged in', function(done) {
		agent.post('/readers')
			.send(reader)
			.expect(401)
			.end(function(readerSaveErr, readerSaveRes) {
				// Call the assertion callback
				done(readerSaveErr);
			});
	});

	it('should not be able to save Reader instance if no name is provided', function(done) {
		// Invalidate name field
		reader.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reader
				agent.post('/readers')
					.send(reader)
					.expect(400)
					.end(function(readerSaveErr, readerSaveRes) {
						// Set message assertion
						(readerSaveRes.body.message).should.match('Please fill Reader name');
						
						// Handle Reader save error
						done(readerSaveErr);
					});
			});
	});

	it('should be able to update Reader instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reader
				agent.post('/readers')
					.send(reader)
					.expect(200)
					.end(function(readerSaveErr, readerSaveRes) {
						// Handle Reader save error
						if (readerSaveErr) done(readerSaveErr);

						// Update Reader name
						reader.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Reader
						agent.put('/readers/' + readerSaveRes.body._id)
							.send(reader)
							.expect(200)
							.end(function(readerUpdateErr, readerUpdateRes) {
								// Handle Reader update error
								if (readerUpdateErr) done(readerUpdateErr);

								// Set assertions
								(readerUpdateRes.body._id).should.equal(readerSaveRes.body._id);
								(readerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Readers if not signed in', function(done) {
		// Create new Reader model instance
		var readerObj = new Reader(reader);

		// Save the Reader
		readerObj.save(function() {
			// Request Readers
			request(app).get('/readers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Reader if not signed in', function(done) {
		// Create new Reader model instance
		var readerObj = new Reader(reader);

		// Save the Reader
		readerObj.save(function() {
			request(app).get('/readers/' + readerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', reader.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Reader instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reader
				agent.post('/readers')
					.send(reader)
					.expect(200)
					.end(function(readerSaveErr, readerSaveRes) {
						// Handle Reader save error
						if (readerSaveErr) done(readerSaveErr);

						// Delete existing Reader
						agent.delete('/readers/' + readerSaveRes.body._id)
							.send(reader)
							.expect(200)
							.end(function(readerDeleteErr, readerDeleteRes) {
								// Handle Reader error error
								if (readerDeleteErr) done(readerDeleteErr);

								// Set assertions
								(readerDeleteRes.body._id).should.equal(readerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Reader instance if not signed in', function(done) {
		// Set Reader user 
		reader.user = user;

		// Create new Reader model instance
		var readerObj = new Reader(reader);

		// Save the Reader
		readerObj.save(function() {
			// Try deleting Reader
			request(app).delete('/readers/' + readerObj._id)
			.expect(401)
			.end(function(readerDeleteErr, readerDeleteRes) {
				// Set message assertion
				(readerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Reader error error
				done(readerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Reader.remove().exec();
		done();
	});
});