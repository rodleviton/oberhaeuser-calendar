export default dayViewComponent => {

  dayViewComponent.controller('DayController', DayController);

  DayController.$inject = ['$log', '$stateParams', 'ChartService', 'Utilities', 'DEFAULTS'];

  /* @ngInject */
  function DayController($log, $stateParams, ChartService, Utilities, DEFAULTS) {
    var vm = this;
    vm.activate = activate;

    function activate() {
      vm.dayConfig = ChartService.getDay($stateParams.year, $stateParams.month, $stateParams.day);
      vm.month = Utilities.getMonthLabel(Utilities.getMonthIndex(vm.dayConfig.month));

      $log.debug(vm.dayConfig);
    }

    vm.activate();

  }
};
