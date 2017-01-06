'use strict';

window.GEILDANKEVR = (function () {
  let SCOPE = {};

  /**
   * Creates a stage and its content for a single full canvas 360 degree video or image.
   * @param { object } config { mediaType: '', url: '', container: {elementObject} }
   * @return { void }
   */
  SCOPE.single = function (config) {
    let isValid = false,
      stage = {};

    isValid = typeof config.container === 'object' &&
      typeof config === 'object';

    GEILDANKEVR.utils.errorChecker(isValid);

    stage = GEILDANKEVR.stage.init(config.container);
    GEILDANKEVR.content.init('single', stage, config);
  };

  /**
   * Creates a stage and its content for a vr gallery view.
   * @param  { object } config { container: {elementObject}, singles: [{mediaType: '', url: ''}] }
   * @return { void }
   */
  SCOPE.gallery = function (config) {
    let isValid = false,
      stage = {};

    isValid = typeof config.container === 'object' &&
      typeof config.singles === 'object';

    GEILDANKEVR.utils.errorChecker(isValid);

    stage = GEILDANKEVR.stage.init(config.container);
    GEILDANKEVR.content.init('gallery', stage, config);
  };

  /**
   * Cancels request animation frame
   * @return { void }
   */
  SCOPE.remove = function () {
    GEILDANKEVR.stage.cancelRenderLoop();
    GEILDANKEVR.stage.destroyScene();
    GEILDANKEVR.content.single.destroy();
  };

  return SCOPE;
}());
