module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var PhemeDatachannelsEndpoint = $resource(Util.apiUrl('/pheme/datachannels'), {
    }, {
        query: {
            method: 'GET'
        }
    });

    return PhemeDatachannelsEndpoint;

}];
