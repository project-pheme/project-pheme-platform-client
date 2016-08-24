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
            value: '=',
            unit: '='
        },
        controller: RangeSelectController,
        templateUrl: 'templates/posts/views/filters/filter-range.html'
    };
}

RangeSelectController.$inject = ['$scope'];
function RangeSelectController($scope) {
}
