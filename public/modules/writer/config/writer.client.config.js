'use strict';

// Configuring the writer module
angular.module('writer').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Write', 'writer', 'item', '/writer');
	}
]);
