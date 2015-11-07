export default 'calendar.view.component';

const calendarViewComponent = angular.module('calendar.view.component', []);

require('./calendar.view.directive.js')(calendarViewComponent);
require('./calendar.view.controller.js')(calendarViewComponent);
require('./calendar.view.routes.js')(calendarViewComponent);
