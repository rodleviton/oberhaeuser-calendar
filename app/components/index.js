export default 'components';

const components = angular.module('components', [
  require('./chart-labels'),
  require('./chart'),
  require('./chart-stamp'),
  require('./events'),
  require('./layout')
]);
