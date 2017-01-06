'use strict';

window.GEILDANKEVR.utils = (function () {
  let SCOPE = {},
    createCrosshairRaycaster = {},
    createPointerRaycaster = {},
    getOrientation = {},
    init = {},
    isVrDisplayMode = false,
    mouse2d = new THREE.Vector2(),
    mouse3d = new THREE.Vector3(),
    onMouseMove = {};

  /**
   * Creates a Raycaster from Camera
   * @param  { number } delayTimeout timeout in ms
   * @param  { object } object to intersect with
   * @param  { Function } callback function what happens when nothing is intersecting
   * @return { void }
   */
  createCrosshairRaycaster = function (delayTimeout, object, callback) {
    let camera = {},
      lookatIntervalId = {},
      raycaster = {};

    raycaster = new THREE.Raycaster();
    camera = GEILDANKEVR.stage.getStage().camera;

    lookatIntervalId = window.setInterval(function () {
      let intersects = [];

      raycaster.set(camera.getWorldPosition(), camera.getWorldDirection());
      intersects = raycaster.intersectObject(object);

      if (intersects.length === 0) {
        callback();
        clearTimeout(delayTimeout);
        clearInterval(lookatIntervalId);
      }
    }, 50);
  };

  /**
   * Creates a Raycaster from Pointer and Camera
   * @param  { number } delayTimeout timeout in ms
   * @param  { object } object to intersect with
   * @param  { Function } callback function what happens when nothing is intersecting
   * @return { void }
   */
  createPointerRaycaster = function (delayTimeout, object, callback) {
    let camera = {},
      lookatIntervalId = {},
      raycaster = {};

    raycaster = new THREE.Raycaster();
    camera = GEILDANKEVR.stage.getStage().camera;

    lookatIntervalId = window.setInterval(function () {
      let intersects = [];

      raycaster.setFromCamera(mouse2d, camera);
      intersects = raycaster.intersectObject(object);

      if (intersects.length === 0) {
        callback();
        clearTimeout(delayTimeout);
        clearInterval(lookatIntervalId);
      }
    }, 50);
  };

  /**
   * Returns cross browser screen.orientation object
   * @return { object } screen.orientation
   */
  getOrientation = function () {
    let orientation = {};

    orientation = screen.orientation.type ||
      screen.mozOrientation.type ||
      screen.msOrientation.type;
    return orientation;
  };

  /**
   * Initialize utils
   * @return { void }
   */
  init = function () {
    if (GEILDANKEVR.mobileDetection &&
        GEILDANKEVR.mobileDetection.isMobile() === false) {
      document.addEventListener('mousemove', onMouseMove, false);
    }
  };

  /**
   * Get Mouse Position on MouseMove
   * @param  { object } event mousemove event
   * @return { void }
   */
  onMouseMove = function (event) {
    let camera = GEILDANKEVR.stage.getStage().camera,
      canvas = GEILDANKEVR.stage.getStage().container,
      offsetX = GEILDANKEVR.utils.getElementPosition(canvas).x,
      offsetY = GEILDANKEVR.utils.getElementPosition(canvas).y,
      viewHeight = GEILDANKEVR.utils.getCanvasDimensions().height,
      viewWidth = GEILDANKEVR.utils.getCanvasDimensions().width;

    event.preventDefault();
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse2d.x = (event.clientX - offsetX) / viewWidth * 2 - 1;
    mouse2d.y = -(event.clientY - offsetY) / viewHeight * 2 + 1;
    mouse3d = new THREE.Vector3(mouse2d.x, mouse2d.y, 0.5).unproject(camera);
  };

  /**
   * Converts degrees to radians
   * @param  { number } degrees to convert in radians
   * @return { number } radians
   */
  SCOPE.degreeToRadians = function (degrees) {
    return degrees * Math.PI / 180;
  };

  /**
   * Checks if the argument is not false
   * @param  { Boolean } isValid argument to be checked
   * @return { void }
   */
  SCOPE.errorChecker = function (isValid) {
    if (!isValid) {
      throw new Error('Arguments are not correct.');
    }
  };

  /**
   * Get the canvas dimensions
   * @return { object } width and height of canvas
   */
  SCOPE.getCanvasDimensions = function () {
    let height = 0,
      width = 0;

    width = GEILDANKEVR.stage.getStage().container.clientWidth;
    height = GEILDANKEVR.stage.getStage().container.clientHeight;

    return {
      height: height,
      width: width
    };
  };

  /**
   * Returns the offset position of an element
   * @param  { object } el element to get the offset values from
   * @return { object } offset x and y of the element
   */
  SCOPE.getElementPosition = function (el) {
    let rect = el.getBoundingClientRect(),
      scrollLeft = 0,
      scrollTop = 0;

    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
      x: rect.left + scrollLeft,
      y: rect.top + scrollTop
    };
  };

  /**
   * Returns a random integer beween both parameters
   * @param { number } min integer
   * @param { number } max integer
   * @return { number } random integer
   */
  SCOPE.getRandomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Returns a random gauss number
   * @param { number } median for gauss number
   * @param { number } variance for gauss number
   * @param { number } cove for gauss number
   * @return { number } gauss number
   */
  SCOPE.getRandomGauss = function (median, variance, cove) {
    return variance * Math.pow(Math.random() - 0.5, cove) + median;
  };

  /**
   * Returns vr display mode
   * @return { boolean } vr display mode active true or false
   */
  SCOPE.getVrDisplayMode = function () {
    return isVrDisplayMode;
  };

  /**
   * Returns true, if app runs in fullscreen
   * @return { Boolean } false if app is not in fullscreen
   */
  SCOPE.isFullscreen = function () {
    let fullscreen = false;

    if (document.webkitFullscreenElement !== null &&
      document.mozFullScreenElement !== null) {
      fullscreen = true;
    }
    return fullscreen;
  };

  /**
   * Returns a boolean depending user is in landscape mode or not
   * @return { Boolean } isLandscapeMode
   */
  SCOPE.isLandscapeMode = function () {
    let isLandscapeMode = false,
      orientation = getOrientation();


    if (orientation === 'landscape-primary' || orientation === 'landscape-secondary') {
      isLandscapeMode = true;
    }
    return isLandscapeMode;
  };

  /**
   * Returns a boolean depending user is in portrait mode or not
   * @return { Boolean } isPortraitMode
   */
  SCOPE.isPortraitMode = function () {
    let isPortraitMode = false,
      orientation = getOrientation();


    if (orientation === 'portrait-primary' || orientation === 'portrait-secondary') {
      isPortraitMode = true;
    }
    return isPortraitMode;
  };

  /**
   * Takes an object and two functions with parameters
   * to handle a user's look at the object
   * First function and params are executed when user looks at object.
   * Second function and params are executed when user looks away again.
   * @param  { object } config object holding the object to check for a look at,
   * the lookAt function and its arguments and
   * the lookAway function ant its arguments
   * @return { void }
   */
  SCOPE.handleLookat = function (config) {
    let delayTimeout,
      isValid = false;

    isValid = typeof config === 'object' &&
      typeof config.element === 'object' &&
      typeof config.lookAt === 'function' &&
      typeof config.lookAtArguments === 'object' &&
      typeof config.lookAway === 'function' &&
      typeof config.lookAwayArguments === 'object';

    GEILDANKEVR.utils.errorChecker(isValid);
    if (config.delay) {
      delayTimeout = setTimeout(() => {
        config.lookAt(config.lookAtArguments);
      }, config.delay);
    } else {
      config.lookAt(config.lookAtArguments);
    }

    if (GEILDANKEVR.mobileDetection.isMobile() === true) {
      createCrosshairRaycaster(delayTimeout, config.element.object, function () {
        config.lookAway(config.lookAwayArguments);
      });
    } else {
      createPointerRaycaster(delayTimeout, config.element.object, function () {
        config.lookAway(config.lookAwayArguments);
      });
    }
  };

  /**
   * Sets the vr display mode
   * @param { boolean } isPresenting event object vrdisplaypresentchange.detail.vrdisplay
   * @return { void }
   */
  SCOPE.setVrDisplayMode = function (isPresenting) {
    isVrDisplayMode = isPresenting;
  };

  /**
   * Returns the Mouse Pointer Vector
   * @return { Object } Vector2
   */
  SCOPE.getMouse2d = function () {
    return mouse2d;
  };

  /**
   * Returns the Mouse Vector in 3d Space
   * @return { Object } Vector3
   */
  SCOPE.getMouse3d = function () {
    return mouse3d;
  };

  init();

  return SCOPE;
}());
