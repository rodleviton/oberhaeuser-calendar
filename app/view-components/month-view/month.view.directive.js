export default monthViewComponent => {

  monthViewComponent.directive('monthView', () => {

    // Usage:
    // <month-view></month-view>

    var directive = {
      restrict: 'AE',
      scope: {},
      replace: true,
      template: require('./month.view.tmpl.html'),
      controller: 'MonthController',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  });
};
