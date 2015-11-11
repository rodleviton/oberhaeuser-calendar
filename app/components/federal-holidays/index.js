export default 'components.federalHolidays';

const federalHolidays = angular.module('components.federalHolidays', []);

require('./federal-holidays.directive')(federalHolidays);
require('./event-item.directive')(federalHolidays);
