module.exports = RangeSelectDirective;

RangeSelectDirective.$inject = [];
function RangeSelectDirective() {
    return {
        restrict: 'E',
        scope: {
            min: '=',
            max: '=',
            label: '=',
            name: '=',
            step: '=',
            value: '=',
            unit: '='
        },
        controller: RangeSelectController,
        templateUrl: 'templates/posts/views/filters/filter-range.html'
    };
}

RangeSelectController.$inject = ['$scope'];
function RangeSelectController($scope) {
    /* Oh lord, please forgive this ugly hack, for the deadlines are close */
    $scope.isControversiality = ($scope.name === 'filter_controversiality');
}
