export default chart => {

  chart.controller('ChartController', ChartController);

  CalendarController.$inject = ['$log'];

  /* @ngInject */
  function ChartController($log) {
    var vm = this;

    $log.debug('chartRing controller');
  }
};
