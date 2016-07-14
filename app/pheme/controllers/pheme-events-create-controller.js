module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    '$route',
    'multiTranslate',
    'PhemeEventsEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $rootScope,
    $location,
    $translate,
    $route,
    multiTranslate,
    PhemeEventsEndpoint,
    Notify,
    _
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    $translate('pheme.events.add_event').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', $scope.currentView);

    $scope.event = { type: 'pheme-event', icon: 'tag' };
    $scope.processing = false;

    $scope.saveEvent = function (event) {
        $scope.processing = true;
        var whereToNext = '/pheme/events';

        var event_obj = {
            name: event.name,
            description: event.description,
            type: "search",
            dataSources: [
                {
                    twitter: {
                        type: "Twitter",
                        keywords: event.keywords
                    }
                }
            ]
        };

        PhemeEventsEndpoint.create(event_obj).$promise.then(function (response) {
            $scope.processing = false;
            Notify.notify('pheme.notify.event_create.success', { name: event.name });
            $location.path(whereToNext);
        }, function (errorResponse) { // error
            Notify.apiErrors(errorResponse);
            $scope.processing = false;
        });
    };

    $scope.cancel = function () {
        $location.path('/pheme/events');
    };
}];
