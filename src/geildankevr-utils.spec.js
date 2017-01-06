/* eslint-disable max-len */
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

  describe('GEIDLANKEVR.utils', function () {
    it('the namespace is GEILDANKEVR.utils', function () {
      expect(typeof GEILDANKEVR.utils).toBe('object');
    });

    it('has method .degreeToRadians()', function () {
      expect(typeof GEILDANKEVR.utils.degreeToRadians).toBe('function');
    });

    it('has method .errorChecker()', function () {
      expect(typeof GEILDANKEVR.utils.errorChecker).toBe('function');
    });

    it('has method .getVrDisplayMode()', function () {
      expect(typeof GEILDANKEVR.utils.getVrDisplayMode).toBe('function');
    });

    it('has method .handleLookat()', function () {
      expect(typeof GEILDANKEVR.utils.handleLookat).toBe('function');
    });

    it('has method .getCanvasDimensions()', function () {
      expect(typeof GEILDANKEVR.utils.getCanvasDimensions).toBe('function');
    });

    it('has method .getElementPosition()', function () {
      expect(typeof GEILDANKEVR.utils.getElementPosition).toBe('function');
    });

    it('returns a number when degreeToRadians is called with a number', function () {
      let radian = GEILDANKEVR.utils.degreeToRadians(90);

      expect(typeof radian).toBe('number');
    });

    it('returns an object when getCanvasDimensions was called', function () {
      let canvasDimenstions = GEILDANKEVR.utils.getCanvasDimensions();

      expect(typeof canvasDimenstions).toBe('object');
    });

    it('returns an object when getElementPosition was called with an object', function () {
      let element = document.createElement('div'),
        elementPosition = GEILDANKEVR.utils.getElementPosition(element);

      expect(typeof elementPosition).toBe('object');
    });

    it('changes degrees to radians', function () {
      let radian = GEILDANKEVR.utils.degreeToRadians(90);

      expect(radian).toBe(1.5707963267948966);
    });

    it('throws an error, when errorChecker is called with a falsy object', function () {
      let failFunction = function () {
          GEILDANKEVR.utils.errorChecker(false);
        },
        successFunction = function () {
          GEILDANKEVR.utils.errorChecker(true);
        };

      expect(failFunction).toThrowError('Arguments are not correct.');
      expect(successFunction).not.toThrowError();
    });

    it('returns a boolean when getVrDisplayMode is called', function () {
      let vrDisplayMode = GEILDANKEVR.utils.getVrDisplayMode();

      expect(vrDisplayMode).toBeBoolean();
    });

    it('handleLookat calls the errorChecker function', function () {
      let element = {
          object: {
            visible: false
          }
        },
        lookAtArguments = {},
        lookAtConfig = {},
        lookAwayArguments = {};

      lookAtConfig = {
        element: element,
        lookAt: function () {},
        lookAtArguments: lookAtArguments,
        lookAway: function () {},
        lookAwayArguments: lookAwayArguments
      };

      spyOn(GEILDANKEVR.utils, 'errorChecker').and.callThrough();
      GEILDANKEVR.utils.handleLookat(lookAtConfig);
      expect(GEILDANKEVR.utils.errorChecker).toHaveBeenCalled();
    });

    describe('setVrDisplayMode', function () {
      it('sets vrDisplayMode to true when isPresenting is true', function () {
        GEILDANKEVR.utils.setVrDisplayMode(true);
        expect(GEILDANKEVR.utils.getVrDisplayMode()).toBe(true);
      });

      it('sets vrDisplayMode to false when isPresenting is false', function () {
        GEILDANKEVR.utils.setVrDisplayMode(false);
        expect(GEILDANKEVR.utils.getVrDisplayMode()).toBe(false);
      });
    });

    it('isPortraitMode returns a boolean', function () {
      let isPortraitMode = GEILDANKEVR.utils.isPortraitMode();

      expect(isPortraitMode).toBeBoolean();
    });

    it('isLandscapeMode returns a boolean', function () {
      let isLandscapeMode = GEILDANKEVR.utils.isLandscapeMode();

      expect(isLandscapeMode).toBeBoolean();
    });

    it('isFullscreen returns a boolean', function () {
      let isFullscreen = GEILDANKEVR.utils.isFullscreen();

      expect(isFullscreen).toBeBoolean();
    });
  });
}());
/* eslint-enable max-len */
