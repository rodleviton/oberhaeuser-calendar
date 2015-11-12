export default monthViewComponent => {

  monthViewComponent.controller('MonthController', MonthController);

  MonthController.$inject = ['$log', '$stateParams', '$state', '$timeout', 'ChartService', 'Utilities', 'DEFAULTS'];

  /* @ngInject */
  function MonthController($log, $stateParams, $state, $timeout, ChartService, Utilities, DEFAULTS) {
    var vm = this;

    vm.activate = activate;
    vm.getMonthLabel = getMonthLabel;
    vm.month = $stateParams.month;
    vm.year = $stateParams.year;
    vm.shade = shade;
    vm.viewDay = viewDay;
    vm.closeView = closeView;

    function activate() {
      var monthConfig = ChartService.getMonth(vm.year, vm.month);
      vm.monthLabel = vm.getMonthLabel();

      $timeout(function () {
        vm.monthConfig = monthConfig;
      }, 0);
    }

    function getMonthLabel() {
      return Utilities.getMonthLabel(Utilities.getMonthIndex(vm.month));
    }

    function shade(item, index) {
      var fillColor = item.fillColor;

      if (!item.isCurrentDay && !item.isEvent) {
        fillColor = Utilities.shadeColor(item.fillColor, (index * -0.02));
      }

      return fillColor;
    }

    function viewDay(day) {
      $state.go('calendar.month.day', {
        day: day
      });
    }

    function closeView() {
      $state.go('calendar');
    }

    vm.activate();

  }
};
