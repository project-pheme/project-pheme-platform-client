module.exports = PhemeThemeDetailController;

PhemeThemeDetailController.$inject = ['$scope', '$controller', '$translate', '$routeParams', 'FormAttributeEndpoint', 'TagEndpoint', 'post', 'theme'];
function PhemeThemeDetailController($scope, $controller, $translate, $routeParams, FormAttributeEndpoint, TagEndpoint, post, theme) {

    $scope.post = post;
    $scope.theme = theme;

    // Set the page title
    $translate('pheme.theme.detail').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    // duplicated from post/detail/post-detail.controller.js
    // Replace tags with full tag object
    $scope.post.tags = $scope.post.tags.map(function (tag) {
        return TagEndpoint.get({id: tag.id, ignore403: true});
    });

    $scope.post.featured_tweet = JSON.parse($scope.post.values['theme-featured-tweet'][0]);

    $scope.visibleTab = 'threads';
    $scope.setVisibleTab = function (tabId) {
        $scope.visibleTab = tabId;
    };

}
