module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    '$route',
    '$routeParams',
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
    $routeParams,
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

    $scope.event = {
        type: 'pheme-event',
        icon: 'tag',
        keywords: [ {id: 1, text: ($routeParams.keywords || "")} ]
    };
    $scope.processing = false;

    $scope.addKeywordField = function () {
        var newItemNo = $scope.event.keywords.length+1;
        $scope.event.keywords.push({id: newItemNo, text: ""});
    }

    $scope.saveEvent = function (event) {
        $scope.processing = true;
        var whereToNext = '/pheme/topics';

        var event_obj = {
            name: event.name,
            description: event.description,
            type: "search",
            dataSources: []
        };

        var keywords = _.filter(_.pluck(event.keywords, 'text'), function(x) { return x && x.trim() != ""; });

        _.each(keywords, function(kw) {
            event_obj.dataSources.push({
                twitter: {
                    type: "Twitter",
                    keywords: kw
                }
            });
        });

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
        $location.path('/pheme/topics');
    };
}];
