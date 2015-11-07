// Deps
const angular = require('angular');

if (ON_TEST) {
  require('angular-mocks/angular-mocks');
}

const appModule = angular.module('app', [
  require('./core'),
  require('./view-components'),
  require('./components')
]);
