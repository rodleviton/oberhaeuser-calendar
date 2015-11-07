export default calendarViewComponent => {

  calendarViewComponent.run(appRun);

  appRun.$inject = ['routerHelper'];

  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'calendar',
      config: {
        url: '/:year',
        template: '<calendar-view></calendar-view>'
      }
    }];
  }
};
