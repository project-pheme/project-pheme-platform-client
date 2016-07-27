module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {
    /* todo: these routes should only exist when the user is admin! */
    $routeProvider
    .when('/pheme/events', {
        controller: require('./controllers/pheme-events-controller.js'),
        templateUrl: 'templates/pheme/events/events.html'
    })
    .when('/pheme/events/create', {
        controller: require('./controllers/pheme-events-create-controller.js'),
        templateUrl: 'templates/pheme/events/events-create.html'
    })
    .when('/pheme/posts/:type/:view?', {
        controller: require('./controllers/pheme-post-views-controller.js'),
        templateUrl: 'templates/posts/views/main.html'
    })
    .when('/pheme/themes/:id', {
        controller: require('./controllers/pheme-theme-detail-controller.js'),
        templateUrl: 'templates/pheme/theme-detail.html',
        resolve: {
            post: ['$route', 'PostEndpoint', function ($route, PostEndpoint) {
                return PostEndpoint.get({ id: $route.current.params.id }).$promise;
            }],
            theme: ['$route', 'PhemeThemesEndpoint', function ($route, PhemeThemesEndpoint) {
                return PhemeThemesEndpoint.get({ id: $route.current.params.id }).$promise;
            }]
        }
    })
    ;

}];
