module.exports = [
    '$resource',
    '$rootScope',
    'Util',
function (
    $resource,
    $rootScope,
    Util
) {

    var PhemeEventsEndpoint = $resource(Util.apiUrl('/pheme/events/:id'), {
        id: '@id'
    }, {
        create: {
            method: 'POST'
        },
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                data = Util.transformResponse(data).results;
                var newData = [];
                for ( eventId in data ) {
                    var event = data[eventId];
                    event.name = event.display_name
                    event.id = event._id;
                    newData.push(event)
                }
                return newData;
            }
        },
    });

    return PhemeEventsEndpoint;

}];
