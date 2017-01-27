module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var PhemeSearchLiveEndpoint = $resource(Util.apiUrl('/pheme/search/live'), {
    }, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    return PhemeSearchLiveEndpoint;

}];
