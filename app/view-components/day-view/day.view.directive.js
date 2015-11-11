export default dayViewComponent => {

  dayViewComponent.directive('dayView', () => {

    // Usage:
    // <day-view></day-view>

    var directive = {
      restrict: 'AE',
      scope: {},
      template: require('./day.view.tmpl.html'),
      controller: 'DayController',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  });
};
