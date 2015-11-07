export default appCore => {

  if (ON_TEST) {
    // component spec
    require('./spec/core.config.spec')(appCore);
  }

  appCore.config(coreConfig);

  coreConfig.$inject = ['$compileProvider'];

  /* @ngInject */
  function coreConfig($compileProvider) {

    // Enable debug info
    $compileProvider.debugInfoEnabled(true);

    if (ON_PROD) {
      // Disable debug info
      $compileProvider.debugInfoEnabled(false);
    }

  }

};
