export default 'view.components';

const viewComponents = angular.module('view.components', [
  require('./calendar-view'),
  require('./month-view'),
  require('./day-view')
]);
