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

ModeContextCategoryFilter.$inject = ['$scope', 'TagEndpoint', 'PostEndpoint', '$q', '_'];
function ModeContextCategoryFilter($scope, TagEndpoint, PostEndpoint, $q, _) {
    $scope.categories = [];
    $scope.showOnly = showOnly;
    $scope.hide = hide;
    //$scope.unknown_post_count = 0;

    activate();

    function activate() {
        // Flush TagEndpoint cache
        TagEndpoint.invalidateCache();
        
        // Load forms
        $scope.categories = TagEndpoint.query();
        var postCountRequest = PostEndpoint.stats({ group_by: 'tags', status: 'all' });

        $q.all([$scope.categories.$promise, postCountRequest.$promise]).then(function (responses) {
            if (!responses[1] || !responses[1].totals || !responses[1].totals[0]) {
                return;
            }
            var values = responses[1].totals[0].values;

            angular.forEach($scope.categories, function (category) {
                var value = _.findWhere(values, { id: category.id });
                category.post_count = value ? value.total : 0;
            });

            // Grab the count for form=null
            // var unknownValue = _.findWhere(values, { id: null });
            // if (unknownValue) {
            //     $scope.unknown_post_count = unknownValue.total;
            // }
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
