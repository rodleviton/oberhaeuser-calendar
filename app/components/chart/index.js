export default 'components.chart';

const chart = angular.module('components.chart', []);

require('./chart.directive')(chart);
require('./chart.service')(chart);
