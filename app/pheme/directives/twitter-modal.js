module.exports = TwitterModalDirective;

TwitterModalDirective.$inject = [];

function TwitterModalDirective() {
  return {
    restrict: 'E',
    scope: {
      tweetId: '@'
    },
    controller: TwitterModalController,
    templateUrl: 'templates/pheme/twitter-modal.html'
  };
};

TwitterModalController.$inject = [
  '$scope',
  '$log'
];
function TwitterModalController(
  $scope,
  $log
) {
  $log.info('TwitterModalController : ');
  $log.info($scope);
}
