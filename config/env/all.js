'use strict';

module.exports = {
	app: {
		title: 'Novelius',
		description: 'Read. Write. Review.',
		keywords: 'Short, Story, Writing, Community, Follow, Read, Subscribe, Review, Write'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/components-font-awesome/css/font-awesome.min.css',
				'public/lib/angular-hotkeys/build/hotkeys.min.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-scroll/angular-scroll.js',
				'public/lib/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
				'public/lib/angular-hotkeys/build/hotkeys.min.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/tether/dist/js/tether.min.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/headroom.js/dist/headroom.min.js',
				'public/lib/headroom.js/dist/angular.headroom.min.js',
				'public/lib/ngFitText/dist/ng-FitText.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
