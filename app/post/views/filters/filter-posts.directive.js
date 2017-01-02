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

FilterPostsController.$inject = ['$scope', '$timeout'];
function FilterPostsController($scope, $timeout) {
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
        $scope.applyValueFilters()
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
        controversiality: 0 ,
        avg_activity: 0 ,
        size : 2
    };

    $scope.filters.values = {
        "theme-controversiality": JSON.stringify({ op: ">=", term: 0.00}),
        "theme-average-activity": JSON.stringify({ op: ">=", term: 0.00}),
        "theme-size": JSON.stringify({ op: ">=", term: 2})
    };

    $scope.applyValueFilters = function() {
        $scope.filters.values['theme-controversiality'] = 
            JSON.stringify({ op: ">=", term: $scope.filter_values.controversiality / 100 });
        $scope.filters.values['theme-average-activity'] = 
            JSON.stringify({ op: ">=", term: $scope.filter_values.avg_activity });
        $scope.filters.values['theme-size'] = 
            JSON.stringify({ op: ">=", term: $scope.filter_values.size });
    };
}
