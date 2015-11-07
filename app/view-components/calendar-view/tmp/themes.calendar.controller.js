export default themesCalendar => {

  themesCalendar.controller('CalendarController', CalendarController);

  CalendarController.$inject = ['$log'];

  /* @ngInject */
  function CalendarController($log) {
    var vm = this;

    vm.activeYear = 2015;
    var DAYS_OF_WEEK = [1, 2, 3, 4, 5, 6, 0];

    vm.activate = activate;

    vm.activate();

    /////////////////////////////////////

    function getDaysInFebruary(year) {
      return new Date(year, 2, 0).getDate();
    }

    function getStartDay(month, year) {
      return new Date(year, month, 0).getDay();
    }

    function activate() {
      vm.months = [{
        name: 'January',
        color: '#90b70c',
        days: 31,
        startIndex: getStartDay(0, vm.activeYear)
      }, {
        name: 'February',
        color: '#90b70c',
        days: getDaysInFebruary(vm.activeYear),
        startIndex: getStartDay(1, vm.activeYear)
      }, {
        name: 'March',
        color: '#587211',
        days: 31,
        startIndex: getStartDay(2, vm.activeYear)
      }, {
        name: 'April',
        color: '#587211',
        days: 30,
        startIndex: getStartDay(3, vm.activeYear)
      }, {
        name: 'May',
        color: '#3d530b',
        days: 31,
        startIndex: getStartDay(4, vm.activeYear)
      }, {
        name: 'June',
        color: '#3d530b',
        days: 30,
        startIndex: getStartDay(5, vm.activeYear)
      }, {
        name: 'July',
        color: '#0199dc',
        days: 31,
        startIndex: getStartDay(6, vm.activeYear)
      }, {
        name: 'August',
        color: '#0199dc',
        days: 31,
        startIndex: getStartDay(7, vm.activeYear)
      }, {
        name: 'September',
        color: '#025d89',
        days: 30,
        startIndex: getStartDay(8, vm.activeYear)
      }, {
        name: 'October',
        color: '#025d89',
        days: 31,
        startIndex: getStartDay(9, vm.activeYear)
      }, {
        name: 'November',
        color: '#014365',
        days: 30,
        startIndex: getStartDay(10, vm.activeYear)
      }, {
        name: 'December',
        color: '#014365',
        days: 31,
        startIndex: getStartDay(11, vm.activeYear)
      }];
    }

  }
};
