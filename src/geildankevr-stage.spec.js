(function () {
  'use strict';

  beforeEach(function () {
    jasmine.addMatchers({
      toBeBoolean: function () {
        return {
          compare: function (actual) {
            return {
              pass: typeof actual === 'boolean',
              message: 'Expected ' + actual + ' is not boolean'
            };
          }
        };
      }
    });
  });

  describe('GEIDLANKEVR.stage', function () {
    it('the namespace is GEILDANKEVR.stage', function () {
      expect(typeof GEILDANKEVR.stage).toBe('object');
    });

    it('has method .getStage()', function () {
      expect(typeof GEILDANKEVR.stage.getStage).toBe('function');
    });

    it('has method .init()', function () {
      expect(typeof GEILDANKEVR.stage.init).toBe('function');
    });

    it('has method .registerAnimation()', function () {
      expect(typeof GEILDANKEVR.stage.registerAnimation).toBe('function');
    });

    it('has method .setLookAt()', function () {
      expect(typeof GEILDANKEVR.stage.setLookAt).toBe('function');
    });

    it('has method .cancelRenderLoop()', function () {
      expect(typeof GEILDANKEVR.stage.cancelRenderLoop).toBe('function');
    });

    it('has method .setClearColor()', function () {
      expect(typeof GEILDANKEVR.stage.setClearColor).toBe('function');
    });

    it('GEILDANKEVR.stage.setLookAtcalls GEILDANKEVR.utils.degreeToRadians', function () {
      spyOn(GEILDANKEVR.utils, 'degreeToRadians');
      GEILDANKEVR.stage.setLookAt(90);
      expect(GEILDANKEVR.utils.degreeToRadians).toHaveBeenCalled();
    });

    it('makeContainerFullscreen returns an HTMLNode', function () {
      let container = document.createElement('div'),
        object = null;

      container.setAttribute('id', 'testContainer');
      spyOn(GEILDANKEVR.stage, 'makeContainerFullscreen').and.callThrough();
      object = GEILDANKEVR.stage.makeContainerFullscreen(container);
      expect(object).toBe(container);
    });

    it('undoContainerFullscreen returns an HTMLNode', function () {
      let container = document.createElement('div'),
        object = null;

      container.setAttribute('id', 'testContainer');
      spyOn(GEILDANKEVR.stage, 'undoContainerFullscreen').and.callThrough();
      object = GEILDANKEVR.stage.undoContainerFullscreen(container);
      expect(object).toBe(container);
    });

    it('getCurrentContainerDimensions returns an object', function () {
      let container = document.createElement('div'),
        dimensions = null;

      spyOn(GEILDANKEVR.stage, 'getCurrentContainerDimensions').and.callThrough();
      dimensions = GEILDANKEVR.stage.getCurrentContainerDimensions(container);
      expect(typeof dimensions).toBe('object');

      dimensions = null;

      spyOn(GEILDANKEVR.utils, 'isLandscapeMode').and.returnValue(true);
      spyOn(GEILDANKEVR.utils, 'isFullscreen').and.returnValue(true);
      dimensions = GEILDANKEVR.stage.getCurrentContainerDimensions(container);
      expect(typeof dimensions).toBe('object');

      dimensions = null;

      GEILDANKEVR.utils.isLandscapeMode.and.returnValue(false);
      spyOn(GEILDANKEVR.utils, 'isPortraitMode').and.returnValue(true);
      dimensions = GEILDANKEVR.stage.getCurrentContainerDimensions(container);
      expect(typeof dimensions).toBe('object');
    });
  });
}());
