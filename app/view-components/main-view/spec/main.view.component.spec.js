/* jshint -W117, -W030 */

export default mainViewComponent => {

  describe('mainView', () => {
    beforeEach(window.module(mainViewComponent.name));

    it('should do something', () => {
      expect(true).to.be.true;
    });

  });

};
