/* jshint -W117, -W030 */

export default mainViewComponent => {

  describe('MainViewController', () => {
    beforeEach(window.module(mainViewComponent.name));

    it('should do something', () => {
      expect(true).to.be.true;
    });

  });

};
