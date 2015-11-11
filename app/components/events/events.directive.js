export default events => {

  events.$inject = ['$log'];

  events.directive('events', ($log) => {

    // Usage:
    // <events></events>

    var directive = {
      restrict: 'AE',
      transclude: true,
      template: require('./events.tmpl.html'),
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
