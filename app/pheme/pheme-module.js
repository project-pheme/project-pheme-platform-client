require('angular-linkify');

angular.module('ushahidi.pheme', ['linkify'])

.service('PhemeEventsEndpoint', require('./services/endpoints/events.js'))
.service('PhemeThemesEndpoint', require('./services/endpoints/themes.js'))
.service('PhemeSearchLiveEndpoint', require('./services/endpoints/searchlive.js'))

//Used for pagination: we already have a limitTo filter built-in to angular,
//let's make a startFrom filter
.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
})

.config(['$provide', function ($provide) {
    $provide.factory('PhemePostViewService', function () {
        return {
            getPostType: function () {
                return this.postType;
            },
            setPostType: function (v) {
                this.postType = v;
            }
        };
    });
    //
    $provide.decorator('modeBarDirective', [
        '$delegate',
        function ($delegate) {
            var directive = $delegate[0];
            //
            directive.templateUrl = 'templates/pheme/mode-bar.html';
            return $delegate;
        }
    ]);
    //
    $provide.decorator('postCardDirective', [
        '$delegate',
        function ($delegate) {
            var directive = $delegate[0];
            // TODO: when we have threads, switch the template or build some ng-if thing
            // Modify the template of the original post card directive
            directive.templateUrl = 'templates/pheme/card.html';
            // Assuming we are dealing with themes, expand that post a little bit
            directive.controller = ['$scope', 'PhemePostViewService', 'TagEndpoint', function ($scope, PhemePostViewService, TagEndpoint) {
                $scope.postType = PhemePostViewService.getPostType();
                if ($scope.postType === 'themes') {
                    // process the contents of the theme post type
                    try {
                        $scope.post.featured_tweet = JSON.parse($scope.post.values['theme-featured-tweet'][0]);
                        $scope.post.values['theme-start-date'][0] = new Date($scope.post.values['theme-start-date'][0]);
                        $scope.post.values['theme-last-activity'][0] = new Date($scope.post.values['theme-last-activity'][0]);
                    } catch (e) {
                        // silent failure
                    }
                }
                TagEndpoint.get({ id: $scope.post.tags[0].id, ignore403: true }, function (tag) {
                    $scope.post.tags[0].$t = tag;
                });
            }];
            return $delegate;
        }
    ]);
    // disable the no posts slider
    $provide.decorator('PostViewService', [
        '$delegate',
        function ($delegate) {
            $delegate.showNoPostsSlider = function () {};
            return $delegate;
        }
    ]);
}])

.config(require('./pheme-routes.js'));
