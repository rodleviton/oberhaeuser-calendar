export default 'app.core';

const appCore = angular.module('app.core', [
  require('angular-ui-router/release/angular-ui-router'),
]);

require('./core.routes.js')(appCore);
require('./core.constants.js')(appCore);
require('./core.config.js')(appCore);
require('./core.run.js')(appCore);
require('./router-helper.provider.js')(appCore);
