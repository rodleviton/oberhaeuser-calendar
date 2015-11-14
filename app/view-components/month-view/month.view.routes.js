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
        template: '<month-view></month-view>',
        onEnter: ['$document', function($document) {
          // Add class to body
          var body = angular.element($document[0].body);
          body.addClass('month-view-active');
        }],
        onExit: ['$document', function($document) {
          // Add class to body
          var body = angular.element($document[0].body);
          body.removeClass('month-view-active');
        }]
      }
    }];
  }
};
