export default 'components';

const components = angular.module('components', [
  require('./chart-labels'),
  require('./chart-ring'),
  require('./chart-stamp'),
  require('./federal-holidays'),
  require('./layout')
]);
