module.exports = PhemePostViewsController;

PhemePostViewsController.$inject = ['$scope', '$controller', '$translate', '$routeParams', 'PostFilters'];
function PhemePostViewsController($scope, $controller, $translate, $routeParams, PostFilters) {

	// ---
	// FIXME: this should actually reuse the controller without  copying its code
	//   something like: angular.extend(this, $controller('PostViewsController', { $scope: $scope }));
	// Set view based out route
    $scope.currentView = $routeParams.view;

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

    $scope.postType = $routeParams.type;

}
