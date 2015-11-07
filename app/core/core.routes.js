export default appCore => {

  appCore.run(appRun);

  appRun.$inject = ['routerHelper'];

  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates(), '/');
  }

  function getStates() {
    return [{
      state: 'index',
      config: {
        url: '/',
        template: '<calendar-view></calendar-view>'
      }
    }];
  }
};
