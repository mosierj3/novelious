'use strict';

(function() {
	// Reviewers Controller Spec
	describe('Reviewers Controller Tests', function() {
		// Initialize global variables
		var ReviewersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Reviewers controller.
			ReviewersController = $controller('ReviewersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Reviewer object fetched from XHR', inject(function(Reviewers) {
			// Create sample Reviewer using the Reviewers service
			var sampleReviewer = new Reviewers({
				name: 'New Reviewer'
			});

			// Create a sample Reviewers array that includes the new Reviewer
			var sampleReviewers = [sampleReviewer];

			// Set GET response
			$httpBackend.expectGET('reviewers').respond(sampleReviewers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reviewers).toEqualData(sampleReviewers);
		}));

		it('$scope.findOne() should create an array with one Reviewer object fetched from XHR using a reviewerId URL parameter', inject(function(Reviewers) {
			// Define a sample Reviewer object
			var sampleReviewer = new Reviewers({
				name: 'New Reviewer'
			});

			// Set the URL parameter
			$stateParams.reviewerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/reviewers\/([0-9a-fA-F]{24})$/).respond(sampleReviewer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reviewer).toEqualData(sampleReviewer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Reviewers) {
			// Create a sample Reviewer object
			var sampleReviewerPostData = new Reviewers({
				name: 'New Reviewer'
			});

			// Create a sample Reviewer response
			var sampleReviewerResponse = new Reviewers({
				_id: '525cf20451979dea2c000001',
				name: 'New Reviewer'
			});

			// Fixture mock form input values
			scope.name = 'New Reviewer';

			// Set POST response
			$httpBackend.expectPOST('reviewers', sampleReviewerPostData).respond(sampleReviewerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Reviewer was created
			expect($location.path()).toBe('/reviewers/' + sampleReviewerResponse._id);
		}));

		it('$scope.update() should update a valid Reviewer', inject(function(Reviewers) {
			// Define a sample Reviewer put data
			var sampleReviewerPutData = new Reviewers({
				_id: '525cf20451979dea2c000001',
				name: 'New Reviewer'
			});

			// Mock Reviewer in scope
			scope.reviewer = sampleReviewerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/reviewers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/reviewers/' + sampleReviewerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid reviewerId and remove the Reviewer from the scope', inject(function(Reviewers) {
			// Create new Reviewer object
			var sampleReviewer = new Reviewers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Reviewers array and include the Reviewer
			scope.reviewers = [sampleReviewer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/reviewers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleReviewer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.reviewers.length).toBe(0);
		}));
	});
}());