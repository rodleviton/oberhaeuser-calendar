export default calendarViewComponent => {

  calendarViewComponent.directive('calendarView', () => {

    // Usage:
    // <calendar-view></calendar-view>

    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {},
      template: require('./calendar.view.tmpl.html'),
      controller: 'CalendarController',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  });
};
