// Deps
const angular = require('angular');

if (ON_TEST) {
  require('angular-mocks/angular-mocks');
}

const appModule = angular.module('app', [
  require('./core'),
  require('./common'),
  require('./view-components'),
  require('./components')
]);
