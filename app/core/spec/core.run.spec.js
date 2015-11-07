/* jshint -W117, -W030 */

export default appCore => {

  describe('coreRun', () => {
    beforeEach(window.module(appCore.name));

    it('should do something', () => {
      expect(true).to.be.true;
    });

  });

};
