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
        { value: "theme-last-activity", label: "Updated" },
        { value: "theme-size", label: "Size" },
        { value: "theme-controversiality", label: "Controversiality" },
        { value: "theme-img-count", label: "# images" },
        { value: "theme-pub-count", label: "# publications" }
    ];

    $scope.vOrderbyChanged = function (selection) {
        $scope.filters.v_orderby = selection.value;
    };

    $scope.setOrder = function (value) {
    	$scope.filters.order = value;
    }

}
