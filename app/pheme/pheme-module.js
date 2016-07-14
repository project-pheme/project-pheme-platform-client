angular.module('ushahidi.pheme', [])
.service('PhemeEventsEndpoint', require('./services/endpoints/events.js'))

.config(require('./pheme-routes.js'));
