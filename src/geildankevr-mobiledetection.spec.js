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

  describe('GEIDLANKEVR.mobileDetection', function () {
    it('the namespace is GEILDANKEVR.mobileDetection', function () {
      expect(typeof GEILDANKEVR.mobileDetection).toBe('object');
    });

    it('has method .isMobile()', function () {
      expect(typeof GEILDANKEVR.mobileDetection.isMobile).toBe('function');
    });

    it('isMobile returns a boolean', function () {
      let isMobile = GEILDANKEVR.mobileDetection.isMobile();

      expect(isMobile).toBeBoolean();
    });
  });
}());
