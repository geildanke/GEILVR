(function () {
  'use strict';

  describe('GEIDLANKEVR.globalEvents', function () {
    it('the namespace is GEILDANKEVR.globalEvents', function () {
      expect(typeof GEILDANKEVR.globalEvents).toBe('object');
    });

    it('has method .handleVrDisplayChange()', function () {
      expect(typeof GEILDANKEVR.globalEvents.handleVrDisplayChange).toBe('function');
    });

    it('call GEILDANKEVR.utils.setVrDisplayMode on vrdisplaypresentchange', function () {
      spyOn(GEILDANKEVR.utils, 'setVrDisplayMode');
      GEILDANKEVR.globalEvents.handleVrDisplayChange({
        detail: {
          vrdisplay: {
            isPresenting: true
          }
        }
      });
      expect(GEILDANKEVR.utils.setVrDisplayMode).toHaveBeenCalled();
    });
  });
}());
