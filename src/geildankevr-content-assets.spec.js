(function () {
  'use strict';

  describe('GEIDLANKEVR.content.assets', function () {
    it('the namespace is GEILDANKEVR.content.assets', function () {
      expect(typeof GEILDANKEVR.assets).toBe('object');
    });

    it('has method .getIconPlayWhite()', function () {
      expect(typeof GEILDANKEVR.assets.getIconPlayWhite).toBe('function');
    });

    it('.getIconPlayWhite() returns a string', function () {
      let dataUriString = null;

      spyOn(GEILDANKEVR.assets, 'getIconPlayWhite').and.callThrough();
      dataUriString = GEILDANKEVR.assets.getIconPlayWhite();
      expect(typeof dataUriString).toBe('string');
    });
  });
}());
