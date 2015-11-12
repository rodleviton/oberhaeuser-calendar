export default dayViewComponent => {

  dayViewComponent.controller('DayController', DayController);

  DayController.$inject = ['$log', '$state', '$stateParams', 'ChartService', 'Utilities', 'DEFAULTS'];

  /* @ngInject */
  function DayController($log, $state, $stateParams, ChartService, Utilities, DEFAULTS) {
    var vm = this;

    vm.activate = activate;
    vm.closeView = closeView;

    function activate() {
      vm.dayConfig = ChartService.getDay($stateParams.year, $stateParams.month, $stateParams.day);
      vm.month = Utilities.getMonthLabel(Utilities.getMonthIndex(vm.dayConfig.month));
    }

    function closeView() {
      $state.go('calendar.month');
    }

    vm.activate();

  }
};
