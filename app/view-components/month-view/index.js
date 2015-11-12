export default 'month.view.component';

const monthViewComponent = angular.module('month.view.component', []);

require('./month.view.directive.js')(monthViewComponent);
require('./month.view.controller.js')(monthViewComponent);
require('./month.view.routes.js')(monthViewComponent);
