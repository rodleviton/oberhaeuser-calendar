export default mainViewComponent => {

  if (ON_TEST) {
    // component spec
    require('./spec/main.view.component.spec')(mainViewComponent);
  }

  mainViewComponent.directive('mainView', () => {

    // Usage:
    // <main-view></main-view>

    var directive = {
      restrict: 'AE',
      scope: {},
      template: require('./main.view.component.html'),
      controller: 'MainViewController',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  });
};
