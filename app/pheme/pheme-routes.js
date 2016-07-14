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
    ;

}];
