angular.module('ushahidi.pheme', [])
.service('PhemeEventsEndpoint', require('./services/endpoints/events.js'))

.config(require('./pheme-routes.js'))

.config(['$provide', function($provide) {
	$provide.decorator('postCardDirective', [
		'$delegate',
		function($delegate) {
			var directive = $delegate[0];
			// TODO: how can we switch the template in function of the type being viewed?
			// Modify the template of the original post card directive
			directive.templateUrl = 'templates/pheme/card.html';
			return $delegate;
		}
	]);
}]);
