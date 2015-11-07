export default footer => {

  footer.directive('calendarFooter', () => {

    // Usage:
    // <calendar-footer></calendar-footer>

    var directive = {
      restrict: 'AE',
      scope: {},
      template: require('./footer.tmpl.html')
    };

    return directive;
  });
};
