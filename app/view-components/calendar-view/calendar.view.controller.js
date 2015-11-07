export default calendarViewComponent => {

  calendarViewComponent.controller('CalendarController', CalendarController);

  CalendarController.$inject = ['$log', '$stateParams'];

  /* @ngInject */
  function CalendarController($log, $stateParams) {
    var vm = this;
    var DAYS_OF_WEEK = [1, 2, 3, 4, 5, 6, 0];

    vm.activeYear = $stateParams.year || 2015;
    vm.activate = activate;
    vm.getStartDay = getStartDay;
    vm.getDaysInFebruary = getDaysInFebruary;

    vm.activate();

    /////////////////////////////////////

    function getDaysInFebruary(year) {
      return new Date(year, 2, 0).getDate();
    }

    function getStartDay(month, year) {
      return new Date(year, month, 0).getDay();
    }

    function activate() {
      vm.months = require('./config/calendar.json');

      // Calculate start day index of month
      angular.forEach(vm.months, function(item, index) {
        item.startIndex = vm.getStartDay(index, vm.activeYear);
      });

      // Calculate days in February
      vm.months[1].days = vm.getDaysInFebruary(vm.activeYear);
    }

  }
};
