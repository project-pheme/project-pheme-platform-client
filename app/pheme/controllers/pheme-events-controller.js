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

    $translate('pheme.events').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode (navigation)
    $scope.$emit('event:mode:change', 'events');

    // Pull events from the server
    $scope.refreshView = function () {
        PhemeEventsEndpoint.query().$promise.then(function (events) {
            $scope.events = events;
        });
        $scope.selectedEvents = [];
    };
    $scope.refreshView();

    // List selection helpers
    $scope.isToggled = function (event) {
        return $scope.selectedEvents.indexOf(event.id) > -1;
    };

    $scope.toggleEvent = function (event) {
        var idx = $scope.selectedEvents.indexOf(event.id);
        if (idx > -1) {
            $scope.selectedEvents.splice(idx, 1);
        } else {
            $scope.selectedEvents.push(event.id);
        }
    };

    $scope.navigateCreate = function (event) {
        $location.path("/pheme/events/create");
    }
    
}];
