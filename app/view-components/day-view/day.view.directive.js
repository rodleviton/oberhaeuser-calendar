export default dayViewComponent => {

  dayViewComponent.directive('dayView', () => {

    // Usage:
    // <day-view></day-view>

    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {},
      template: require('./day.view.tmpl.html'),
      controller: 'DayController',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  });
};
