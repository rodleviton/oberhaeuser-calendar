export default 'view.components';

const viewComponents = angular.module('view.components', [
  require('./main-view'),
  require('./calendar-view'),
  require('./day-view')
]);
