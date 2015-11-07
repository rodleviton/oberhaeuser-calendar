export default themesCalendar => {

  themesCalendar.run(appRun);

  appRun.$inject = ['routerHelper'];

  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'calendar',
      config: {
        url: '/calendar',
        template: '<theme-calendar></theme-calendar>'
      }
    }];
  }
};
