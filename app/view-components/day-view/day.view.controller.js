export default dayViewComponent => {

  dayViewComponent.controller('DayController', DayController);

  DayController.$inject = ['$log', '$scope', '$state', '$stateParams', '$timeout', 'ChartService', 'GapiService', 'Utilities', 'DEFAULTS'];

  /* @ngInject */
  function DayController($log, $scope, $state, $stateParams, $timeout, ChartService, GapiService, Utilities, DEFAULTS) {
    var vm = this;

    vm.activate = activate;
    vm.closeView = closeView;
    vm.showCard = false;

    function activate() {
      vm.dayConfig = ChartService.getDay($stateParams.year, $stateParams.month, $stateParams.day);
      vm.month = Utilities.getMonthLabel(Utilities.getMonthIndex(vm.dayConfig.month));

      $log.debug(vm.dayConfig);

      // Ensures card is animated on first load
      $timeout(function () {
        vm.showCard = true;
      }, 250);

      if (GapiService.data.isAuthorised) {
        getEvents();
      } else {
        $scope.$on('GAPI_AUTHENTICATED', getEvents);
      }

    }

    function closeView() {
      $state.go('calendar.month');
    }

    function getEvents() {
      var fromDate = vm.dayConfig.year + '-' + parseInt(vm.dayConfig.month) + '-' + parseInt(vm.dayConfig.day);
      var toDate = vm.dayConfig.year + '-' + parseInt(vm.dayConfig.month) + '-' + (parseInt(vm.dayConfig.day) + 1);

      GapiService.getEvents(fromDate, toDate).then(function (events) {
        $log.debug(events);

        $timeout(function () {
          if (events && events.length > 0) {
            vm.events = events;
          }
        }, 250);

      });
    }

    vm.activate();

  }
};
