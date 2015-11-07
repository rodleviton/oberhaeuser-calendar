export default themesCalendar => {

  themesCalendar.directive('themeCalendar', () => {

    // Usage:
    // <theme-calendar></theme-calendar>

    var directive = {
      restrict: 'AE',
      scope: {},
      template: require('./themes.calendar.tmpl.html'),
      controller: 'CalendarController',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  });
};
