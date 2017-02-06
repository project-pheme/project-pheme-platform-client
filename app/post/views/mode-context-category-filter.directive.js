module.exports = ModeContextCategoryFilterDirective;

ModeContextCategoryFilterDirective.$inject = [];
function ModeContextCategoryFilterDirective() {
    return {
        restrict: 'E',
        scope: true,
        controller: ModeContextCategoryFilter,
        templateUrl: 'templates/posts/views/mode-context-category-filter.html'
    };
}

ModeContextCategoryFilter.$inject = ['$scope', 'TagEndpoint', 'PostEndpoint', 'PhemeEventsEndpoint', '$q', '$interval', '$log', '_'];
function ModeContextCategoryFilter($scope, TagEndpoint, PostEndpoint, PhemeEventsEndpoint, $q, $interval, $log, _) {
    $scope.categories = [];
    $scope.showOnly = showOnly;
    $scope.hide = hide;
    $scope.isFilterable = ($scope.filters !== undefined);

    activate();

    function activate() {
        loadData();
        $interval(updateData, 30000);
    }

    function queryData() {
        // Flush TagEndpoint cache
        TagEndpoint.invalidateCache();

        // Load forms
        var categories = TagEndpoint.query();
        var postCountRequest = PostEndpoint.stats({ group_by: 'tags', status: 'all' });
        var events = PhemeEventsEndpoint.query();

        return $q.all([categories.$promise, postCountRequest.$promise, events.$promise]).then(function (responses) {
            if (!responses[1] || !responses[1].totals || !responses[1].totals[0]) {
                return;
            }
            var values = responses[1].totals[0].values;
            angular.forEach(categories, function (category) {
                var value = _.findWhere(values, { id: category.id });
                var ev = _.findWhere(events, { category_id: category.id });
                var now = new Date();
                category.post_count = value ? value.total : 0;
                if (!ev || !ev['capture-end-date']) {
                    category.capture_status = 'unknown';
                } else {
                    var end_date = ev['capture-end-date'];
                    if (now - end_date > 3600000) {
                        category.capture_status = 'stopped';
                    } else if (category.post_count > 0) {
                        category.capture_status = 'capturing';
                    } else {
                        category.capture_status = 'initialising';
                    }
                }
            });
            return categories;

            // Grab the count for form=null
            // var unknownValue = _.findWhere(values, { id: null });
            // if (unknownValue) {
            //     $scope.unknown_post_count = unknownValue.total;
            // }
        });
    }

    function loadData() {
        queryData().then(function (categories) {
            $scope.categories = categories;
        });
    }

    function updateData() {
        queryData().then(function (categories) {
            angular.forEach(categories, function (category) {
                var scopeCat = _.findWhere($scope.categories, { id: category.id });
                if (!scopeCat) {
                    $scope.categories.push(category);
                } else {
                    scopeCat.capture_status = category.capture_status;
                    scopeCat.post_count = category.post_count;
                }
            });
        });
    }

    function showOnly(categoryId) {
        $scope.filters.tags.splice(0, $scope.filters.tags.length, categoryId);
    }

    function hide(categoryId) {
        var index = $scope.filters.tags.indexOf(categoryId);
        if (index !== -1) {
            $scope.filters.tags.splice(index, 1);
        }
    }
}
