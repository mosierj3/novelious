'use strict';

// Configuring the Reader module
angular.module('reader').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Read', 'reader', 'item', '/reader(/create)?',null,null,0);
		//Menus.addSubMenuItem('Reader', 'reader', 'List Subscriptions', 'reader');
		//Menus.addSubMenuItem('Reader', 'reader', 'New Subscription', 'reader/create');
	}
]);
