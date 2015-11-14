export default appCore => {

  if (ON_TEST) {
    // component spec
    require('./spec/core.run.spec')(appCore);
  }

  appCore.run(coreRun);

  coreRun.$inject = ['$log'];

  /* @ngInject */
  function coreRun($log) {

  }

};
