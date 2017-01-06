'use strict';

window.GEILDANKEVR.stage = (function () {
  const DEFAULT_COLOR_CLEAR = new THREE.Color(0x000000);

  let SCOPE = {},
    addListeners,
    animate,
    createCamera,
    createCameraDolly,
    createControls,
    createRenderer,
    createScene,
    createVREffect,
    createVRManager,
    getCurrentContainerDimensions,
    makeContainerFullscreen,
    onFullscreenChange,
    onFullscreenEnd,
    onFullscreenStart,
    onResize,
    prepareDocument,
    requestAnimationFrameId,
    setCanvasDimensions,
    stage = {},
    undoContainerFullscreen,
    updateQueue = {};

  /**
   * Add event listeners for resize and vrdisplaypresentchange.
   * @param { object } container: DOM element of the canvas container
   * @param { object } camera: THREE.js camera object
   * @param { object } effect: THREE.js VR effect
   * @return { void }
   */
  addListeners = function (container, camera, effect) {
    let fullscreenEvents = ['webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'];

    window.addEventListener('resize', function () {
      onResize(container, camera, effect);
    }, true);
    window.addEventListener('vrdisplaypresentchange', function () {
      onResize(container, camera, effect);
    }, true);

    // Bind to fullscreen events.
    for (let i = 0, max = fullscreenEvents.length; i < max; i = i + 1) {
      document.addEventListener(
        fullscreenEvents[i],
        onFullscreenChange.bind(null, container, camera, effect),
        true
      );
    }
  };

  /**
   * Check if app is already in fullscreen mode and
   * handle fullscreen start and fullscreen end
   * @param  { object } container object
   * @param  { object } camera object
   * @param  { object } effect object
   * @return { void }
   */
  onFullscreenChange = function (container, camera, effect) {
    if (GEILDANKEVR.utils.isFullscreen()) {
      onFullscreenStart(container, camera, effect);
    } else {
      onFullscreenEnd(container, camera, effect);
    }
  };

  /**
   * Animation loop
   * @param { number } timestamp: DOMHighResTimeStamp
   * @param { object } controls: THREE.js VR controls
   * @param { object } camera: THREE.js camera object
   * @param { object } manager: WebVRManager object
   * @param { object } scene: THREE.js scene
   * @return { void }
   */
  animate = function (timestamp, controls, camera, manager, scene) {
    controls.update();
    manager.render(scene, camera, timestamp);
    Object.keys(updateQueue).forEach((key) => {
      updateQueue[ key ]();
    });
    requestAnimationFrameId = requestAnimationFrame(function () {
      animate(timestamp, controls, camera, manager, scene);
    });
  };

  /**
   * Creates a THREE.js perspective camera
   * and returns it.
   * @param { object } cameraContainer: DOM element of the canvas container
   * @return { object } THREE.PerspectiveCamera | object
   */
  createCamera = function (cameraContainer) {
    let camera,
      containerRatio = cameraContainer.offsetWidth / cameraContainer.offsetHeight;

    camera = new THREE.PerspectiveCamera(75, containerRatio, 0.1, 10000);
    return camera;
  };

  /**
   * Create a camera dolly for animations and rotation/position setting
   * @param  { object } camera object
   * @return { object } dolly THREE.Group object
   */
  createCameraDolly = function (camera) {
    let dolly = {};

    dolly = new THREE.Group();
    dolly.add(camera);
    return dolly;
  };

  /**
   * Create THREE.js VR controls
   * and returns them.
   * @param { object } camera: THREE.js camera object
   * @return { object } THREE.VRControls | object
   */
  createControls = function (camera) {
    let controls;

    controls = new THREE.VRControls(camera);
    controls.standing = true;
    return controls;
  };

  /**
   * Create THREE.js WebGL renderer
   * and returns it.
   * @return { object } THREE.WebGLRenderer | object
   */
  createRenderer = function () {
    let renderer;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(DEFAULT_COLOR_CLEAR, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
  };

  /**
   * Creates THREE.js scene
   * and returns it.
   * @return { object } THREE.Scene | object
   */
  createScene = function () {
    let scene;

    scene = new THREE.Scene();
    return scene;
  };

  /**
   * Creates THREE.js VR effect
   * and returns it.
   * @param {object} renderer: THREE.js renderer
   * @param {object} container: DOM element of the canvas container
   * @return { object } THREE.VREffect | object
   */
  createVREffect = function (renderer, container) {
    let effect;

    effect = new THREE.VREffect(renderer);
    effect.setSize(container.offsetWidth, container.offsetHeight);
    return effect;
  };

  /**
   * Creates a WebVR manager
   * and returns it.
   * @param {object} renderer: THREE.js renderer
   * @param {object} effect: THREE.js VR effect
   * @param {object} container: DOM element of the canvas container
   * @return { object } WebVRManager | object
   */
  createVRManager = function (renderer, effect, container) {
    let manager,
      params = {
        hideButton: false,
        isUndistorted: false
      };

    // container.className += ' webvr-polyfill-fullscreen-wrapper';
    manager = new WebVRManager(renderer, effect, params, container);
    return manager;
  };

  /**
   * Returns the container dimensions,
   * depending on wether user is in fullscreen mode or not
   * @param  { object } container element
   * @return {object} dimensions.width and dimenstions.height
   */
  getCurrentContainerDimensions = function (container) {
    let dimensions = {};

    dimensions.width = container.offsetWidth;
    dimensions.height = container.offsetHeight;
    if (GEILDANKEVR.utils.isFullscreen() && GEILDANKEVR.utils.isLandscapeMode()) {
      dimensions.width = screen.width;
      dimensions.height = screen.height;
    } else if (GEILDANKEVR.utils.isFullscreen() && GEILDANKEVR.utils.isPortraitMode()) {
      dimensions.width = screen.width;
      dimensions.height = screen.height;
    }
    return dimensions;
  };

  /**
   * Add fullscreen styling
   * @param  { HTMLNode } container element
   * @return { HTMLNode } container element
   */
  makeContainerFullscreen = function (container) {
    container.style.paddingBottom = '0';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.width = screen.width;
    container.style.width = screen.width + 'px';
    container.height = screen.height;
    container.style.height = screen.height + 'px';
    container.style.zIndex = '1';
    return container;
  };

  /**
   * Modify canvas wrapper container and canvas
   * before closing fullscreen mode.
   * Must be done, because the canvas
   * was resized to screen width and height
   * and should be resetted to default state.
   * @param { object } container: DOM element of the canvas container
   * @param { object } camera: THREE.js camera object
   * @param { object } effect: THREE.js VR effect
   * @return { void }
   */
  onFullscreenEnd = function (container, camera, effect) {
    undoContainerFullscreen(container);
    setCanvasDimensions(container, container.offsetWidth, container.offsetHeight);
    onResize(container, camera, effect);
  };

  /**
   * Modify canvas wrapper container and canvas
   * before opening fullscreen mode.
   * Must be done, because the canvas
   * has to be resized to screen width and height.
   * @param { object } container: DOM element of the canvas container
   * @param { object } camera: THREE.js camera object
   * @param { object } effect: THREE.js VR effect
   * @return { void }
   */
  onFullscreenStart = function (container, camera, effect) {
    makeContainerFullscreen(container);
    setCanvasDimensions(container, screen.width, screen.height);
    onResize(container, camera, effect);
  };

  /**
   * Resizes camera and effect
   * @param {object} container: DOM element of the canvas container
   * @param { object } camera: THREE.js camera object
   * @param {object} effect: THREE.js VR effect
   * @return { void }
   */
  onResize = function (container, camera, effect) {
    let dimensions = {};

    if (GEILDANKEVR.utils.isFullscreen()) {
      makeContainerFullscreen(container);
    }
    dimensions = getCurrentContainerDimensions(container);
    effect.setSize(dimensions.width, dimensions.height);
    camera.aspect = dimensions.width / dimensions.height;
    camera.updateProjectionMatrix();
  };

  /**
   * Prepares the DOM
   * @return { void }
   */
  prepareDocument = function () {
     // does make touch swipe on mobile in fullscreen possible
    document.body.style.width = '100%';
  };

  /**
   * Set the width of a canvas
   * contained in the container.
   * @param { object } container: DOM element of the canvas container
   * @param { object } width: container width
   * @param { object } height: container height
   * @return { void }
   */
  setCanvasDimensions = function (container, width, height) {
    let canvas = container.getElementsByTagName('canvas')[ 0 ];

    canvas.width = width;
    canvas.style.width = width + 'px';
    canvas.height = height;
    canvas.style.height = height + 'px';
  };

  /**
   * Remove fullscreen styling
   * @param  { HTMLNode } container element
   * @return { HTMLNode } container element
   */
  undoContainerFullscreen = function (container) {
    container.style.removeProperty('padding-bottom');
    container.style.removeProperty('position');
    container.style.removeProperty('top');
    container.style.removeProperty('left');
    container.style.removeProperty('width');
    container.style.removeProperty('height');
    container.style.removeProperty('z-index');
    return container;
  };

  /**
   * Cancels request animation frame
   * @return { void }
   */
  SCOPE.cancelRenderLoop = function () {
    cancelAnimationFrame(requestAnimationFrameId);
  };

  /**
   * Returns stage object
   * @return { object } stage object
   */
  SCOPE.getStage = function () {
    return stage;
  };

  /**
   * Creates and returns a stage,
   * adds event listeners and starts the animation loop.
   * @param  { object } container {elementObject}
   * @param { object } config optional config object
   * @return { object } stage object
   */
  SCOPE.init = function (container, config) {
    let camera,
      clock,
      controls,
      dolly,
      effect,
      isValid,
      manager,
      renderer,
      scene;

    isValid = typeof container === 'object';

    GEILDANKEVR.utils.errorChecker(isValid);

    renderer = createRenderer(config);
    scene = createScene();
    camera = createCamera(container);
    controls = createControls(camera);
    effect = createVREffect(renderer, container);
    manager = createVRManager(renderer, effect, container);
    dolly = createCameraDolly(camera);
    clock = new THREE.Clock();

    prepareDocument();

    container.appendChild(renderer.domElement);
    scene.add(dolly);

    stage.renderer = renderer;
    stage.camera = camera;
    stage.controls = controls;
    stage.dolly = dolly;
    stage.manager = manager;
    stage.scene = scene;
    stage.renderer = renderer;
    stage.clock = clock;
    stage.container = container;

    requestAnimationFrame(function (timestamp) {
      animate(timestamp,
        controls,
        camera,
        manager,
        scene
      );
    });

    addListeners(container, camera, effect);

    return stage;
  };

/**
 * Register an animation, that has to be added to the render loop
 * @param  { string } guid string to describe animation
 * @param  { Function } callback animation function
 * @return { void }
 */
  SCOPE.registerAnimation = function (guid, callback) {
    updateQueue[guid] = callback;
  };

  /**
   * Deregisters an animation, removes it from the render loop
   * @param  { string } guid string to describe animation
   * @return { void }
   */
  SCOPE.deregisterAnimation = function (guid) {
    delete updateQueue[guid];
  };

  /**
   * Destroys a scene to clear memory
   * @return { void }
   */
  SCOPE.destroyScene = function () {
    stage.scene = null;
    stage.camera = null;
    stage.controls = null;
    stage.manager = null;
    stage.dolly = null;
    stage.renderer = null;
  };

  /**
   * Sets the renderer's clear color
   * @param { color } color THREE.js color object
   * @return { void }
   */
  SCOPE.setClearColor = function (color) {
    stage.renderer.clearColor = color;
  };

  /**
   * Rotate camera/user dolly around y axis to some degree
   * @param { number } yRotationDegree degree to rotate user/camera dolly around y axis
   * @return { void }
   */
  SCOPE.setLookAt = function (yRotationDegree) {
    let yRotationRadian = GEILDANKEVR.utils.degreeToRadians(yRotationDegree);

    stage.dolly.rotation.y = yRotationRadian;
  };

  // PRIVATE START
  SCOPE.getCurrentContainerDimensions = getCurrentContainerDimensions;
  SCOPE.makeContainerFullscreen = makeContainerFullscreen;
  SCOPE.onFullscreenStart = onFullscreenStart;
  SCOPE.undoContainerFullscreen = undoContainerFullscreen;
  // PRIVATE END

  return SCOPE;
}());
