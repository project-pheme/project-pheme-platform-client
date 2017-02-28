module.exports = FilterPostsDirective;

FilterPostsDirective.$inject = [];
function FilterPostsDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        replace: true,
        controller: FilterPostsController,
        templateUrl: 'templates/posts/views/filters/filter-posts.html'
    };
}

FilterPostsController.$inject = ['$scope', '$timeout', '$rootScope'];
function FilterPostsController($scope, $timeout, $rootScope) {
    $scope.searchSavedToggle = false;
    $scope.searchFiltersToggle = false;
    $scope.cancel = cancel;
    $scope.applyFilters = applyFilters;
    $scope.toggleSaved = toggleSaved;
    $scope.toggleFilters = toggleFilters;

    activate();

    function activate() {
        // @todo define initial filter values
        // $scope.$watch('filters', handleFilterChange, true);
    }

    function cancel() {
        // Reset filters
        rollbackForm();
        // .. and close the dropdown
        $scope.searchFiltersToggle = false;
    }

    function applyFilters(event) {
        // ngFormController automatically commits changes to the model ($scope.filters)
        // apply value filters
        $scope.applyValueFilters();
        // Just close the dropdown
        $scope.searchFiltersToggle = false;
    }

    function toggleSaved() {
        $scope.searchSavedToggle = !$scope.searchSavedToggle;
        $scope.searchFiltersToggle = false;
    }

    function toggleFilters() {
        $scope.searchFiltersToggle = !$scope.searchFiltersToggle;
        $scope.searchSavedToggle = false;

        // Reset the form
        rollbackForm();
    }

    function rollbackForm() {
        // Store value of q
        var q = $scope.postFiltersForm.q.$viewValue;
        // Rolback form
        $scope.postFiltersForm.$rollbackViewValue();
        // Restore value of q
        $scope.postFiltersForm.q.$setViewValue(q);
        $scope.postFiltersForm.q.$render();
    }

    // Indirect binding of filter values to the filter set
    $scope.filter_values = {
        controversiality: -33,
        avg_activity: 0,
        size : 2
    };

    $scope.applyValueFilters = function () {
        if ($scope.filters.values === undefined) {
            $scope.filters.values = {};
        }
        $scope.filters.values['theme-controversiality'] =
            JSON.stringify({ op: '>=', term: $scope.filter_values.controversiality / 100 });
        $scope.filters.values['theme-average-activity'] =
            JSON.stringify({ op: '>=', term: $scope.filter_values.avg_activity });
        $scope.filters.values['theme-size'] =
            JSON.stringify({ op: '>=', term: $scope.filter_values.size });
    };

    $scope.applyValueFilters(); // initialise actual filters that get sent to the API

    /* @todo: this is probably not great */
    $rootScope.clearValueFilters = function () {
        $scope.filter_values.controversiality = -33;
        $scope.filter_values.avg_activity = 0;
        $scope.filter_values.size = 2;
    };
    $rootScope.applyValueFilters = $scope.applyValueFilters;

}
