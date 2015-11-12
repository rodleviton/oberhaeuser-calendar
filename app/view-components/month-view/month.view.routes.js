export default monthViewComponent => {

  monthViewComponent.run(appRun);

  appRun.$inject = ['routerHelper'];

  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
    {
      state: 'calendar.month',
      config: {
        url: '/:month',
        template: '<month-view></month-view>'
      }
    }];
  }
};
