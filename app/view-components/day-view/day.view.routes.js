export default dayViewComponent => {

  dayViewComponent.run(appRun);

  appRun.$inject = ['routerHelper'];

  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
    {
      state: 'calendar.month.day',
      config: {
        url: '/:day',
        template: '<day-view></day-view>',
        onEnter: ['$document', function($document) {
          // Add class to body
          var body = angular.element($document[0].body);
          body.addClass('day-view-active');
        }],
        onExit: ['$document', function($document) {
          // Add class to body
          var body = angular.element($document[0].body);
          body.removeClass('day-view-active');
        }]
      }
    }];
  }
};
