require('angular-linkify');

angular.module('ushahidi.pheme', ['linkify'])

.service('PhemeEventsEndpoint', require('./services/endpoints/events.js'))
.service('PhemeThemesEndpoint', require('./services/endpoints/themes.js'))

.config(['$provide', function($provide) {
	$provide.factory('PhemePostViewService', function() {
		return {
			getPostType: function() {
				return this.postType;
			},
			setPostType: function(v) {
				this.postType = v;
			}
		}
	});
	//
	$provide.decorator('modeBarDirective', [
		'$delegate',
		function($delegate) {
			var directive = $delegate[0];
			//
			directive.templateUrl = 'templates/pheme/mode-bar.html';
			return $delegate;
		}
	]);
	//
	$provide.decorator('postCardDirective', [
		'$delegate',
		function($delegate) {
			var directive = $delegate[0];
			// TODO: when we have threads, switch the template or build some ng-if thing
			// Modify the template of the original post card directive
			directive.templateUrl = 'templates/pheme/card.html';
			// Assuming we are dealing with themes, expand that post a little bit
			directive.controller = [ '$scope', 'PhemePostViewService', function($scope, PhemePostViewService) {
				$scope.postType = PhemePostViewService.getPostType();
				if ($scope.postType == 'themes') {
					// process the contents of the theme post type
					try {
						$scope.post.featured_tweet = JSON.parse($scope.post.values['theme-featured-tweet'][0]);
					} catch (e) {
						// silent failure
					}
				}
			} ];
			return $delegate;
		}
	]);
}])

.config(require('./pheme-routes.js'));
