export default header => {

  header.directive('calendarHeader', () => {

    // Usage:
    // <calendar-header></calendar-header>

    var directive = {
      restrict: 'AE',
      scope: {
        year: '='
      },
      template: require('./header.tmpl.html'),
      link: link
    };

    return directive;

    function link(scope, element, attrs) {

    }

  });
};
