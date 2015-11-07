/* jshint -W117, -W030 */

export default appCore => {

  describe('coreConfig', () => {
    beforeEach(window.module(appCore.name));

    it('should do something', () => {
      expect(true).to.be.true;
    });

  });

};
