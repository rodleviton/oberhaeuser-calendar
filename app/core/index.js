export default 'app.core';

require('../styles/main.scss');
var ngLodash = require('ng-lodash');
var moment = require('moment');
var angularMoment = require('angular-moment');

const appCore = angular.module('app.core', [
  require('angular-animate'),
  require('angular-ui-router/release/angular-ui-router'),
  'ngAnimate',
  'ngLodash',
  'angularMoment'
]);

require('./core.routes.js')(appCore);
require('./core.constants.js')(appCore);
require('./core.config.js')(appCore);
require('./core.run.js')(appCore);
require('./router-helper.provider.js')(appCore);
