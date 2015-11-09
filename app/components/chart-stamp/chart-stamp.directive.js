export default chartStamp => {

  chartStamp.$inject = ['$log'];

  chartStamp.directive('chartStamp', ($log) => {

    // Usage:
    // <chart-stamp</chart-stamp>

    var directive = {
      restrict: 'AE',
      replace: true,
      template: require('./chart-stamp.tmpl.html'),
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
