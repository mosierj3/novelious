'use strict';

// Configuring the Articles module
angular.module('reviewers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Review', 'reviewers', 'item', '/reviewers(/create)?',null,null,2);
		//Menus.addSubMenuItem('Review', 'reviewers', 'List Reviewers', 'reviewers');
		//Menus.addSubMenuItem('Review', 'reviewers', 'New Reviewer', 'reviewers/create');
	}
]);
