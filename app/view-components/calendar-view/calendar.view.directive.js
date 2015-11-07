export default calendarViewComponent => {

  calendarViewComponent.directive('calendarView', () => {

    // Usage:
    // <calendar-view></calendar-view>

    var directive = {
      restrict: 'AE',
      scope: {},
      template: require('./calendar.view.tmpl.html'),
      controller: 'CalendarController',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  });
};
