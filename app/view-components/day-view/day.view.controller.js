export default dayViewComponent => {

  dayViewComponent.controller('DayController', DayController);

  DayController.$inject = ['$log', '$stateParams'];

  /* @ngInject */
  function DayController($log, $stateParams) {
    var vm = this;

    var MONTH_LABELS = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    vm.day = $stateParams.day;
    vm.month = MONTH_LABELS[getMonthIndex($stateParams.month)];

    function getMonthIndex(month) {
      var index = parseInt(month.replace(/^0+/, '')) - 1;

      return index;
    }

  }
};
