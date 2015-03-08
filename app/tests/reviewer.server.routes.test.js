'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Reviewer = mongoose.model('Reviewer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, reviewer;

/**
 * Reviewer routes tests
 */
describe('Reviewer CRUD tests', function() {
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

		// Save a user to the test db and create new Reviewer
		user.save(function() {
			reviewer = {
				name: 'Reviewer Name'
			};

			done();
		});
	});

	it('should be able to save Reviewer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reviewer
				agent.post('/reviewers')
					.send(reviewer)
					.expect(200)
					.end(function(reviewerSaveErr, reviewerSaveRes) {
						// Handle Reviewer save error
						if (reviewerSaveErr) done(reviewerSaveErr);

						// Get a list of Reviewers
						agent.get('/reviewers')
							.end(function(reviewersGetErr, reviewersGetRes) {
								// Handle Reviewer save error
								if (reviewersGetErr) done(reviewersGetErr);

								// Get Reviewers list
								var reviewers = reviewersGetRes.body;

								// Set assertions
								(reviewers[0].user._id).should.equal(userId);
								(reviewers[0].name).should.match('Reviewer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Reviewer instance if not logged in', function(done) {
		agent.post('/reviewers')
			.send(reviewer)
			.expect(401)
			.end(function(reviewerSaveErr, reviewerSaveRes) {
				// Call the assertion callback
				done(reviewerSaveErr);
			});
	});

	it('should not be able to save Reviewer instance if no name is provided', function(done) {
		// Invalidate name field
		reviewer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reviewer
				agent.post('/reviewers')
					.send(reviewer)
					.expect(400)
					.end(function(reviewerSaveErr, reviewerSaveRes) {
						// Set message assertion
						(reviewerSaveRes.body.message).should.match('Please fill Reviewer name');
						
						// Handle Reviewer save error
						done(reviewerSaveErr);
					});
			});
	});

	it('should be able to update Reviewer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reviewer
				agent.post('/reviewers')
					.send(reviewer)
					.expect(200)
					.end(function(reviewerSaveErr, reviewerSaveRes) {
						// Handle Reviewer save error
						if (reviewerSaveErr) done(reviewerSaveErr);

						// Update Reviewer name
						reviewer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Reviewer
						agent.put('/reviewers/' + reviewerSaveRes.body._id)
							.send(reviewer)
							.expect(200)
							.end(function(reviewerUpdateErr, reviewerUpdateRes) {
								// Handle Reviewer update error
								if (reviewerUpdateErr) done(reviewerUpdateErr);

								// Set assertions
								(reviewerUpdateRes.body._id).should.equal(reviewerSaveRes.body._id);
								(reviewerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Reviewers if not signed in', function(done) {
		// Create new Reviewer model instance
		var reviewerObj = new Reviewer(reviewer);

		// Save the Reviewer
		reviewerObj.save(function() {
			// Request Reviewers
			request(app).get('/reviewers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Reviewer if not signed in', function(done) {
		// Create new Reviewer model instance
		var reviewerObj = new Reviewer(reviewer);

		// Save the Reviewer
		reviewerObj.save(function() {
			request(app).get('/reviewers/' + reviewerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', reviewer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Reviewer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reviewer
				agent.post('/reviewers')
					.send(reviewer)
					.expect(200)
					.end(function(reviewerSaveErr, reviewerSaveRes) {
						// Handle Reviewer save error
						if (reviewerSaveErr) done(reviewerSaveErr);

						// Delete existing Reviewer
						agent.delete('/reviewers/' + reviewerSaveRes.body._id)
							.send(reviewer)
							.expect(200)
							.end(function(reviewerDeleteErr, reviewerDeleteRes) {
								// Handle Reviewer error error
								if (reviewerDeleteErr) done(reviewerDeleteErr);

								// Set assertions
								(reviewerDeleteRes.body._id).should.equal(reviewerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Reviewer instance if not signed in', function(done) {
		// Set Reviewer user 
		reviewer.user = user;

		// Create new Reviewer model instance
		var reviewerObj = new Reviewer(reviewer);

		// Save the Reviewer
		reviewerObj.save(function() {
			// Try deleting Reviewer
			request(app).delete('/reviewers/' + reviewerObj._id)
			.expect(401)
			.end(function(reviewerDeleteErr, reviewerDeleteRes) {
				// Set message assertion
				(reviewerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Reviewer error error
				done(reviewerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Reviewer.remove().exec();
		done();
	});
});