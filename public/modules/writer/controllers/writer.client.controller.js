'use strict';

// Writer controller
angular.module('writer').controller('WriterController', [
	'$rootScope', '$scope', '$stateParams', '$location', '$timeout', '$interval',
	'Authentication', 'Menus', 'Story', 'Chapter',
	function(
		$rootScope, $scope, $stateParams, $location, $timeout, $interval,
		Authentication, Menus, Story, Chapter
		) {
		$scope.authentication = Authentication;
		$rootScope.story = null;
		$rootScope.stories = null;
		$rootScope.chapter = null;
		$rootScope.chapters = null;

		initWriter();


		// Initialize Module
		function initWriter() {
			if(!$rootScope.stories) {
				$rootScope.stories = Story.query(function(){
					if($stateParams.storyId) {
						// Repopulate story on page load (if applicable)
						$scope.findOneStory();
						if($stateParams.chapterId) {
							// Repopulate chapter on page load (if applicable)
							$scope.findOneChapter();
						}
					}
				});
			}
		};

		// Resets
		$scope.resetWriter = function() {
			$rootScope.story = null;
			$rootScope.chapter = null;
			$rootScope.chapters = null;
		};
		$scope.resetStory = function() {
			$rootScope.chapter = null;
		};

		// Autosave
		var timeout;
  	var debounceSaveUpdates = function(newVal, oldVal) {
    	if (newVal != oldVal) {

					if (timeout) {
        		$timeout.cancel(timeout);
      		}
      		timeout = $timeout(function(){
						$scope.updateChapter();
					}, 1000);
			}
  	};
		$scope.$watch('chapter.text', debounceSaveUpdates);
		$scope.$watch('chapter.title', debounceSaveUpdates);

		// Create new Story
		$scope.createStory = function() {
			// Create new Writer object
			var story = new Story ({
				title: this.title,
				author: this.author
			});
			// Save
			story.$save(function(response) {
				// Add new story to list after save
				$rootScope.stories.push(response);
				// Redirect after save
				$location.path('writer/story/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Story
		$scope.removeStory = function(story) {
			var story = new Story($rootScope.story);
			if ( $rootScope.story ) {
				for (var i in $rootScope.stories) {
					if ($rootScope.stories[i]._id === $rootScope.story._id) {
						$rootScope.stories.splice(i, 1);
					}
				}
				story.$remove({ storyId: $stateParams.storyId });
				$location.path('writer');
			}
		};

		// Update existing Story
		$scope.updateStory = function() {
			var story = new Story($rootScope.story);
			story.$update({ storyId: $stateParams.storyId },
				function(response) {
				}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Story
		$scope.findOneStory = function() {
			// Reset vars
			$rootScope.story = null;
			$rootScope.chapter = null;
			$rootScope.chapters = null;
			// Populate rootScope vars
			angular.forEach($rootScope.stories, function(s, i){
				if (s._id === $stateParams.storyId) {
					$rootScope.story = s;
					$rootScope.chapters = s.chapters;
				}
			});
		};

		// Create new Chapter
		$scope.createChapter = function() {
			// Create new Chapter object
			var chapter = new Chapter ({
				story: $stateParams.storyId,
				title: this.title
			});
			// Save
			chapter.$save({storyId: $stateParams.storyId}, function(response) {
				// Add new chapter to list after save
				angular.forEach($rootScope.stories, function(story){
					if (story._id === $stateParams.storyId) {
						story.chapters.push(response);
					}
				});
				// Redirect after save
				$location.path('writer/story/' + $stateParams.storyId + '/chapter/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Chapter
		$scope.removeChapter = function() {
			var chapter = new Chapter($rootScope.chapter);
			angular.forEach($rootScope.stories, function(story){
				if (story._id === $stateParams.storyId) {
					angular.forEach(story.chapters, function(chapter, i){
						if(chapter._id === $stateParams.chapterId) {
							story.chapters.splice(i, 1);
						}
					});
				}
			});
			chapter.$remove({
				storyId: $stateParams.storyId,
				chapterId: $stateParams.chapterId
			});
			$rootScope.chapter = null;
			$location.path('writer/story/' + $stateParams.storyId);
		};

		// Update existing Chapter
		$scope.updateChapter = function() {
			var chapter = new Chapter($rootScope.chapter);
			chapter.$update({
				storyId: $stateParams.storyId,
				chapterId: $stateParams.chapterId
			}, function() {}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Chapter
		$scope.findOneChapter = function() {
			$rootScope.chapter = null;
			angular.forEach($rootScope.chapters, function(chapter){
				if (chapter._id === $stateParams.chapterId) {
					$rootScope.chapter = chapter;
				}
			});
		};
	}
]);
