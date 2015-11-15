export default dayViewComponent => {

  dayViewComponent.controller('DayController', DayController);

  DayController.$inject = ['$log', '$scope', '$state', '$stateParams', '$http', '$timeout', 'ChartService', 'GapiService', 'Utilities',
    'DEFAULTS'
  ];

  /* @ngInject */
  function DayController($log, $scope, $state, $stateParams, $http, $timeout, ChartService, GapiService, Utilities, DEFAULTS) {
    var vm = this;

    vm.activate = activate;
    vm.closeView = closeView;
    vm.shade = shade;
    vm.getWeather = getWeather;
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

      vm.getWeather();
    }

    function closeView() {
      $state.go('calendar.month');
    }

    function getWeather() {
      $log.debug('getting weather');

      $http({
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/weather?q=Melbourne,au&units=metric&appid=b4f9054600e35ea0971b0981dadd9731'
      }).then(function successCallback(response) {
        $log.debug(response);
        vm.tempMin = response.data.main.temp_min;
        vm.tempMax = response.data.main.temp_max;
        vm.city = response.data.name;
      }, function errorCallback(response) {
        $log.debug(response);
      });
    }

    function shade(item, index) {
      var fillColor = item.fillColor;

      if (!item.isCurrentDay && !item.isEvent) {
        fillColor = Utilities.shadeColor(item.fillColor, ((index + 1) * 0.10));
      }

      return fillColor;
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
