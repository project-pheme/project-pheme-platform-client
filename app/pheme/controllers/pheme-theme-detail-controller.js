module.exports = PhemeThemeDetailController;

PhemeThemeDetailController.$inject = [
    '$scope',
    '$rootScope',
    '$controller',
    '$translate',
    '$routeParams',
    'FormAttributeEndpoint',
    'TagEndpoint',
    'Maps',
    'leafletData',
    'ModalService',
    'post',
    'theme',
    'linkify',
    '$log',
    '$q',
    '_'
];
function PhemeThemeDetailController(
    $scope,
    $rootScope,
    $controller,
    $translate,
    $routeParams,
    FormAttributeEndpoint,
    TagEndpoint,
    Maps,
    leafletData,
    ModalService,
    post,
    theme,
    linkify,
    $log,
    $q,
    _
) {

    $rootScope.setLayout('layout-c');
    $scope.post = post;
    $scope.theme = theme;

    // Set the page title
    $translate('pheme.theme.detail').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    // duplicated from post/detail/post-detail.controller.js
    // Replace tags with full tag object
    $scope.post.tags = $scope.post.tags.map(function (tag) {
        return TagEndpoint.get({id: tag.id, ignore403: true});
    });

    $scope.post.featured_tweet = JSON.parse($scope.post.values['theme-featured-tweet'][0]);
    $scope.post.values['theme-start-date'][0] = new Date($scope.post.values['theme-start-date'][0]);
    $scope.post.values['theme-last-activity'][0] = new Date($scope.post.values['theme-last-activity'][0]);

    $scope.visibleTab = 'threads';
    $scope.setVisibleTab = function (tabId) {
        $scope.visibleTab = tabId;
    };

    // Transform some data values
    (theme.threads || []).forEach(function (thread) {
        thread.featured_tweet.veracity_score = parseFloat(thread.featured_tweet.veracity_score || '0.0');
    });
    $scope.current_thread_page = 0;

    $scope.openTwitterModal = function (tweetId) {
        ModalService.openTemplate('<twitter-modal tweetId="' + tweetId + '"></twitter-modal>', '', 'star', $scope, true, true);
    };


    // MAP rendering

    // Set initial map params
    angular.extend($scope, Maps.getInitialScope());
    // Load map params, including config from server (async)
    var config = Maps.getAngularScopeParams();
    var cfg_done = config.then(function (params) {
        angular.extend($scope, params);
        if (theme.locations.authors.length) {
            $scope.mapDataLoaded = true;
            return true;
        }
        return false;
    });

    // Transform author location data to geojson
    var authorLocations = theme.locations.authors;
    $scope.geojson = {
        onEachFeature: function (feature, layer) {
            var key = '<p class="text">' + feature.properties.text + '</p>';
            key += '<p class="user">@' + feature.properties.user + '</p>';
            key = linkify.twitter(key);
            layer.bindPopup(key);
        }
    };
    $scope.geojson.data = _.map(authorLocations, function (loc) {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [loc.long, loc.lat]
            },
            properties: {
                text: loc.text,
                user: loc.userHandle
            }
        };
    });

    $scope.$watch('visibleTab', function () {
        if ($scope.visibleTab !== 'places') {
            return;
        }
        // Show map once config loaded
        $q.all({
            mapDataLoaded: cfg_done,
            map: leafletData.getMap('post-map'),
            geojson: leafletData.getGeoJSON('post-map')
        })
        // Set map options, add layers, and set bounds
        .then(function (data) {
            if (!data.mapDataLoaded) {
                return;
            }
            // Draw the map after a timeout, to make sure DOM is ready
            setTimeout(function () {
                // Disable 'Leaflet prefix on attributions'
                data.map.attributionControl.setPrefix(false);

                // Center map on geojson
                data.map.invalidateSize();
                data.map.fitBounds(data.geojson.getBounds());
                // Avoid zooming further than 5 (particularly when we just have a single point)
                if (data.map.getZoom() > 5) {
                    data.map.setZoom(5);
                }
            }, 50);
        });
    });

}
