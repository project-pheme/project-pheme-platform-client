module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    '$route',
    'multiTranslate',
    'PhemeEventsEndpoint',
    'PhemeSearchLiveEndpoint',
    'Notify',
    '_',
    '$log',
function (
    $scope,
    $rootScope,
    $location,
    $translate,
    $route,
    multiTranslate,
    PhemeEventsEndpoint,
    PhemeSearchLiveEndpoint,
    Notify,
    _,
    $log
) {

    $scope.$log = $log;
    $scope._ = _;
    $scope.searchKeywords = "";
    $scope.showResults = 'events';
    $scope.liveResults = {
        status: "loading",
        results: [],
        pag: {
            current: 0,
            size: 10
        }
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
            // Sort events in descending order by "updated"
            events.forEach(function(event) {
                event.updated = Date.parse(event.updated)
            })
            events.sort(function (e1, e2) { return e2.updated - e1.updated; });
            $scope.events = events;
        }).catch(function (error) {
            $log.error("events-controller err: " + error);
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
        $location.path("/pheme/topics/create");
        if ($scope.searchKeywords) {
            $location.search('keywords', $scope.searchKeywords);
        }
    }

    $scope.keywordChange = function (event) {
        if ($scope.searchKeywords == "" && $scope.showResults == 'live') {
            $scope.showResults = 'events';
        }
    }

    $scope.keywordSearch = function (event) {
        $scope.liveResults.status = 'loading';
        $scope.liveResults.results = [];
        $scope.showResults = 'live';
        PhemeSearchLiveEndpoint.query({ keywords: $scope.searchKeywords }).$promise.then(function (results) {
            $log.info(results);
            $scope.liveResults.status = 'loaded';
            $scope.liveResults.results = results;
            $scope.liveResults.pag.current = 0;
        });
    };
    
}];
