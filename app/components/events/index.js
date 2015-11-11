export default 'components.events';

const events = angular.module('components.events', []);

require('./events.directive')(events);
require('./event-item.directive')(events);
