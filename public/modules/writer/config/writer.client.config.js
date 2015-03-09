'use strict';

// Configuring the writer module
angular.module('writer').run(['Menus', 'Story',
	function(Menus, Story) {
		// Set top bar menu items
		Menus.removeMenuItem('topbar', '/writer/home');
		Menus.addMenuItem('topbar', 'Write', 'writer', 'dropdown', '/writer/home',null,null,1);
		Menus.addSubMenuItem('topbar', 'writer', 'New Story', 'writer/create');
		//enus.addSubMenuDivider('topbar', 'writer');

		Story.query(function(response){
			angular.forEach(response, function(story){
				Menus.addSubMenuItem('topbar', 'writer', story.title, 'writer/story/' + story._id);
			});
		});
	}
]);
