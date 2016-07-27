module.exports = PhemePostViewsController;

PhemePostViewsController.$inject = ['$scope', '$controller', '$translate', '$routeParams', 'PostFilters', 'PhemePostViewService'];
function PhemePostViewsController($scope, $controller, $translate, $routeParams, PostFilters, PhemePostViewService) {

	// --- copied from original controller
    // Set view based out route
    $scope.currentView = $routeParams.view;
    $scope.postType = $routeParams.type;

    // Change mode (navigation)
    $scope.$emit('event:mode:change', $scope.postType);

    // Set the page title
    $translate('post.posts').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.filters = PostFilters.getFilters();
    // ---

    // TODO: add implicit filter based on the type route parameter

	// Custom pheme stuff goes here...

    // Set the custom page title
    $translate('post.posts').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    // Set the post type being looked at, share with deep-nested directives via service
    PhemePostViewService.setPostType($scope.postType);

}
