export default 'main.view.component';

const mainViewComponent = angular.module('main.view.component', []);

require('../../styles/main.scss');
require('./main.view.component.js')(mainViewComponent);
require('./main.view.controller.js')(mainViewComponent);
