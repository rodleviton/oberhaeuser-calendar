export default federalHolidays => {

  federalHolidays.$inject = ['$log'];

  federalHolidays.directive('federalHolidays', ($log) => {

    // Usage:
    // <federal-holidays</federal-holidays>

    var directive = {
      restrict: 'AE',
      replace: true,
      template: require('./federal-holidays.tmpl.html'),
      scope: {
        config: '='
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs) {

    }
  });
};
