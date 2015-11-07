export default appCore => {

  if (ON_TEST) {
    // component spec
    require('./spec/core.run.spec')(appCore);
  }

  appCore.run(coreRun);

  coreRun.$inject = ['$log', '$rootScope', '$document'];

  /* @ngInject */
  function coreRun($log, $rootScope, $document) {
    /**
     * Add unique class to body per route
     */
    $rootScope.$on('$stateChangeSuccess', function (ev, data) {
      var body = angular.element($document[0].body);
      body.removeAttr('class');
      body.addClass('theme-' + data.name);
    });
  }

};
