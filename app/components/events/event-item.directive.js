export default events => {

  events.$inject = ['$log', 'moment', 'ChartService'];

  events.directive('eventItem', ($log, moment, ChartService) => {

    // Usage:
    // <event-item</event-item>

    var directive = {
      restrict: 'AE',
      //replace: true,
      template: require('./event-item.tmpl.html'),
      scope: {
        label: '=',
        date: '='
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.month = parseInt(moment(scope.date).format('M')) - 1; // JavaScript month format
      scope.day = parseInt(moment(scope.date).format('D')) - 1;

      scope.focusEvent = function(isFocused) {
        ChartService.focusEvent(scope.month, scope.day, isFocused);
      };
    }
  });
};
