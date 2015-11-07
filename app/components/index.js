export default 'components';

const components = angular.module('components', [
  require('./chart-labels'),
  require('./chart-ring'),
  require('./layout')
]);
