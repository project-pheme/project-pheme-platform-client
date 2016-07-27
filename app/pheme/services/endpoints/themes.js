module.exports = [
    '$resource',
    '$rootScope',
    'Util',
function (
    $resource,
    $rootScope,
    Util
) {

    var PhemeThemesEndpoint = $resource(Util.apiUrl('/pheme/themes/:id'), {
        id: '@id'
    });

    return PhemeThemesEndpoint;

}];
