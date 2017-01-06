(function () {
  'use strict';
  describe('GEIDLANKEVR.content.single', function () {
    it('the namespace is GEILDANKEVR.content.single', function () {
      expect(typeof GEILDANKEVR.content.single).toBe('object');
    });

    it('has method .endAnimation()', function () {
      expect(typeof GEILDANKEVR.content.single.endAnimation).toBe('function');
    });

    it('has method .startAnimation()', function () {
      expect(typeof GEILDANKEVR.content.single.startAnimation).toBe('function');
    });

    it('has method .init()', function () {
      expect(typeof GEILDANKEVR.content.single.init).toBe('function');
    });

    it('has method .destroy()', function () {
      expect(typeof GEILDANKEVR.content.single.destroy).toBe('function');
    });

    it('has method .addVideoPlayButton()', function () {
      expect(typeof GEILDANKEVR.content.single.addVideoPlayButton).toBe('function');
    });

    it('addVideoPlayButton calls GEILDANKEVR.stage.getStage()', function () {
      let element = document.createElement('div'),
        fakeStage = {
          container: element
        };

      spyOn(GEILDANKEVR.stage, 'getStage').and.returnValue(fakeStage);
      GEILDANKEVR.content.single.addVideoPlayButton();
      expect(GEILDANKEVR.stage.getStage).toHaveBeenCalled();
    });

    it('.endAnimation() calls GEILDANKEVR.stage.registerAnimation', function () {
      spyOn(GEILDANKEVR.stage, 'deregisterAnimation').and.callThrough();
      GEILDANKEVR.content.single.endAnimation();
      expect(GEILDANKEVR.stage.deregisterAnimation).toHaveBeenCalled();
    });

    it('.startAnimation() calls GEILDANKEVR.stage.registerAnimation', function () {
      spyOn(GEILDANKEVR.stage, 'registerAnimation');
      GEILDANKEVR.content.single.startAnimation();
      expect(GEILDANKEVR.stage.registerAnimation).toHaveBeenCalled();
    });

    it('handleOptionalAnimationSpeed returns a number', function () {
      let speed = null;

      spyOn(GEILDANKEVR.content.single, 'handleOptionalAnimationSpeed').and.callThrough();
      speed = GEILDANKEVR.content.single.handleOptionalAnimationSpeed(90);
      expect(speed).toBe(90);
    });
  });
}());
