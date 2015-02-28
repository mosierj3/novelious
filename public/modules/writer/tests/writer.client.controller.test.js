'use strict';

(function() {
	// Writer Controller Spec
	describe('Writer Controller Tests', function() {
		// Initialize global variables
		var WriterController,
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

			// Initialize the Writer controller.
			WriterController = $controller('WriterController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Writer object fetched from XHR', inject(function(Writer) {
			// Create sample Writer using the Writer service
			var sampleWriter = new Writer({
				name: 'New Writer'
			});

			// Create a sample Writer array that includes the new Writer
			var sampleWriter = [sampleWriter];

			// Set GET response
			$httpBackend.expectGET('writer').respond(sampleWriter);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.writer).toEqualData(sampleWriter);
		}));

		it('$scope.findOne() should create an array with one Writer object fetched from XHR using a writerId URL parameter', inject(function(Writer) {
			// Define a sample Writer object
			var sampleWriter = new Writer({
				name: 'New Writer'
			});

			// Set the URL parameter
			$stateParams.writerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/writer\/([0-9a-fA-F]{24})$/).respond(sampleWriter);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.writer).toEqualData(sampleWriter);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Writer) {
			// Create a sample Writer object
			var sampleWriterPostData = new Writer({
				name: 'New Writer'
			});

			// Create a sample Writer response
			var sampleWriterResponse = new Writer({
				_id: '525cf20451979dea2c000001',
				name: 'New Writer'
			});

			// Fixture mock form input values
			scope.name = 'New Writer';

			// Set POST response
			$httpBackend.expectPOST('writer', sampleWriterPostData).respond(sampleWriterResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Writer was created
			expect($location.path()).toBe('/writer/' + sampleWriterResponse._id);
		}));

		it('$scope.update() should update a valid Writer', inject(function(Writer) {
			// Define a sample Writer put data
			var sampleWriterPutData = new Writer({
				_id: '525cf20451979dea2c000001',
				name: 'New Writer'
			});

			// Mock Writer in scope
			scope.writer = sampleWriterPutData;

			// Set PUT response
			$httpBackend.expectPUT(/writer\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/writer/' + sampleWriterPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid writerId and remove the Writer from the scope', inject(function(Writer) {
			// Create new Writer object
			var sampleWriter = new Writer({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Writer array and include the Writer
			scope.writer = [sampleWriter];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/writer\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWriter);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.writer.length).toBe(0);
		}));
	});
}());
