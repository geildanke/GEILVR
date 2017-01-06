(function () {
  'use strict';

  let galleryConfig = {},
    singleConfigImage = {},
    singleConfigVideo = {};

  beforeEach(function () {
    galleryConfig = {
      container: document.body,
      singles: [{
        mediaType: 'image',
        url: 'base/example/images/instavr.jpg'
      }, {
        mediaType: 'image',
        url: 'base/example/images/map.jpg'
      }]
    };

    singleConfigImage = {
      container: document.body,
      single: {
        mediaType: 'image',
        url: 'base/example/images/instavr.jpg'
      }
    };

    singleConfigVideo = {
      container: document.body,
      single: {
        mediaType: 'video',
        url: {
          mp4: '/videos/vr-italy.MP4',
          webm: '/videos/vr-italy.webm'
        },
        optionalConfig: {
          startRotation: 90,
          isAnimation: true,
          animationSpeed: 5,
          videoPoster: '/images/map.jpg'
        }
      }
    };
  });


  describe('GEIDLANKEVR.core', function () {
    it('the namespace is GEILDANKEVR', function () {
      expect(typeof GEILDANKEVR).toBe('object');
    });

    it('has methods .single() and .gallery()', function () {
      expect(typeof GEILDANKEVR.single).toBe('function');
      expect(typeof GEILDANKEVR.gallery).toBe('function');
    });

    it('has method .remove()', function () {
      expect(typeof GEILDANKEVR.remove).toBe('function');
    });

    it('should call stage.init() function with an image config', function () {
      spyOn(GEILDANKEVR.stage, 'init').and.callThrough();
      GEILDANKEVR.single(singleConfigImage);
      expect(GEILDANKEVR.stage.init).toHaveBeenCalled();
    });

    it('.remove() should call stage.cancelRenderLoop()', function () {
      spyOn(GEILDANKEVR.stage, 'cancelRenderLoop');
      GEILDANKEVR.remove();
      expect(GEILDANKEVR.stage.cancelRenderLoop).toHaveBeenCalled();
    });

    it('should call stage.init() function with an image config', function () {
      spyOn(GEILDANKEVR.content, 'init').and.callThrough();
      GEILDANKEVR.single(singleConfigImage);
      expect(GEILDANKEVR.content.init).toHaveBeenCalled();
    });

    it('should call stage.init() function with a video config', function () {
      spyOn(GEILDANKEVR.content, 'init').and.callThrough();
      GEILDANKEVR.single(singleConfigVideo);
      expect(GEILDANKEVR.content.init).toHaveBeenCalled();
    });

    it('should call stage.init() function with a gallery config', function () {
      spyOn(GEILDANKEVR.content, 'init').and.callThrough();
      GEILDANKEVR.gallery(galleryConfig);
      expect(GEILDANKEVR.content.init).toHaveBeenCalled();
    });
  });
}());
