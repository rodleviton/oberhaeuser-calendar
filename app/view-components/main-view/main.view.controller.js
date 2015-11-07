export default mainViewComponent => {

  if (ON_TEST) {
    // component spec
    require('./spec/main.view.controller.spec')(mainViewComponent);
  }

  mainViewComponent.controller('MainViewController', MainViewController);

  MainViewController.$inject = ['$log'];

  /* @ngInject */
  function MainViewController($log) {
    var vm = this;

    vm.activate = activate;

    vm.activate();

    /////////////////////////////////////

    function activate() {

    }

  }

};
