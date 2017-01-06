(function () {
  'use strict';

  describe('GEIDLANKEVR.content.gallery', function () {
    let addArgs = {},
      config,
      stage;

    beforeEach(() => {
      config = {
        container: document.body,
        singles: [{
          mediaType: 'image',
          url: '/images/instavr.jpg'
        }, {
          mediaType: 'image',
          url: '/images/instavr.jpg'
        }]
      };

      stage = GEILDANKEVR.stage.init(config.container);

      stage.scene = {
        add: function () {
          addArgs.thumbs = arguments[0];
          addArgs.world = arguments[1];
          addArgs.ui = arguments[2];
        }
      };

      GEILDANKEVR.content.gallery.init(stage, config);
    });

    it('the namespace is GEILDANKEVR.content.gallery', function () {
      expect(typeof GEILDANKEVR.content.gallery).toBe('object');
    });

    it('creates two opposite SIF', function () {
      let ui = addArgs.ui;

      expect(ui.type).toBe('Object3D');
      expect(ui.children.length).toEqual(2);
    });

    it('SIF both have different direction sign', function () {
      let ui = addArgs.ui;

      expect(ui.children[0].sign).toEqual(-1);
      expect(ui.children[1].sign).toEqual(1);
    });

    it('Renders a crosshair point', function () {
      if (GEILDANKEVR.mobileDetection &&
          GEILDANKEVR.mobileDetection.isMobile() === true) {
        expect(stage.camera.children[0].type).toEqual('Mesh');
      } else {
        // test if points are in scene
      }
    });

    it('SIF will change their state when setMode is called', function () {
      let leftSIF,
        ui = addArgs.ui;

      leftSIF = ui.children[0];

      expect(leftSIF.setMode).toBeTruthy();
      expect(leftSIF.state.mode).toEqual('idle');
      expect(leftSIF.material.opacity).toEqual(0.2);

      leftSIF.setMode('scroll');
      expect(leftSIF.state.mode).toEqual('scroll');
      expect(leftSIF.material.opacity).toEqual(0.6);

      leftSIF.setMode('error');
      expect(leftSIF.state.mode).toEqual('error');
      expect(leftSIF.material.opacity).toEqual(0.6);
      expect(leftSIF.material.color.r).toEqual((new THREE.Color(0xee1515)).r);
    });

    it('removes animation when you look away from ui', function () {
      let thumbConfig = {
        object: {
          setMode: function (mode) {
            expect(mode).toEqual('idle');
          }
        }
      };

      spyOn(thumbConfig.object, 'setMode');
      spyOn(GEILDANKEVR.stage, 'deregisterAnimation');
      GEILDANKEVR.content.gallery.endThumbAnimation(thumbConfig);
      expect(GEILDANKEVR.stage.deregisterAnimation).toHaveBeenCalled();
      expect(thumbConfig.object.setMode).toHaveBeenCalled();
    });

    it('starts animation when you look at ui', function () {
      let cb,
        thumbConfig = {
          object: {
            setMode: function (mode) {
              let options = ['error', 'scroll'];

              expect(options.indexOf(mode)).toBeGreaterThan(-1);
            }
          },
          sign: 1
        };

      spyOn(GEILDANKEVR.stage, 'registerAnimation');
      GEILDANKEVR.content.gallery.startThumbAnimation(thumbConfig);
      expect(GEILDANKEVR.stage.registerAnimation).toHaveBeenCalled();
      cb = GEILDANKEVR.stage.registerAnimation.calls.mostRecent().args[1];
      cb();

      addArgs.thumbs.scrollOffset.current = 10;
      cb();
    });
  });
}());
