export default 'day.view.component';

const dayViewComponent = angular.module('day.view.component', []);

require('./day.view.directive.js')(dayViewComponent);
require('./day.view.controller.js')(dayViewComponent);
require('./day.view.routes.js')(dayViewComponent);
