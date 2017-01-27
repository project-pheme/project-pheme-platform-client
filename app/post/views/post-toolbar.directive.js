module.exports = PostToolbarDirective;

PostToolbarDirective.$inject = [];
function PostToolbarDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        controller: PostToolbarController,
        templateUrl: 'templates/posts/views/post-toolbar.html'
    };
}

PostToolbarController.$inject = ['$scope'];
function PostToolbarController($scope) {

    $scope.vOrderbyOptions = [
        { value: 'theme-last-activity', label: 'pheme.sort.updated' },
        { value: 'theme-size', label: 'pheme.sort.size' },
        { value: 'theme-controversiality', label: 'pheme.sort.controversiality' },
        { value: 'theme-img-count', label: 'pheme.sort.images' },
        { value: 'theme-pub-count', label: 'pheme.sort.publications' }
    ];

    $scope.vOrderbyChanged = function (selection) {
        $scope.filters.v_orderby = selection.value;
    };

    $scope.setOrder = function (value) {
        $scope.filters.order = value;
    };

}
