'use strict';

window.GEILDANKEVR.content.single = (function () {
  const DEFAULT_ANIMATION_SPEED = 10,
    VIDEO_PLAY_BUTTON_ID = 'GEILDANKEVR-video-play';

  let SCOPE = {},
    addVideoPlayButton,
    createVRSphere,
    createVideo,
    createVideoPlayHandling = {},
    createVideoSources = {},
    endAnimation = {},
    handleOptionalAnimationSpeed = {},
    handleOptionalClearColor = {},
    handleOptionalConfig = {},
    handleOptionalIsAnimation = {},
    handleOptionalStartRotation = {},
    handleOptionalVideoMute = {},
    handleOptionalVideoPoster = {},
    handleVrDisplayModeChange = {},
    removeVideo = {},
    removeVideoPlayButton = {},
    startAnimation = {},
    video = null,
    videoMaterial = null,
    videoTexture = null;

  /**
   * Adds a play icon to the stage container
   * @return { void }
   */
  addVideoPlayButton = function () {
    let button = {},
      container = {},
      videoPlayIcon = GEILDANKEVR.assets.getIconPlayWhite();

    button = document.createElement('div');
    button.setAttribute('id', VIDEO_PLAY_BUTTON_ID);
    button.style.backgroundImage = 'url(' + videoPlayIcon + ')';
    button.style.backgroundColor = 'transparent';
    button.style.backgroundSize = 'contain';
    button.style.backgroundPosition = 'center center';
    button.style.backgroundRepeat = 'no-repeat';
    button.style.content = '';
    button.style.display = 'block';
    button.style.position = 'absolute';
    button.style.top = '50%';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.width = '40px';
    button.style.height = '40px';

    container = GEILDANKEVR.stage.getStage().container;
    container.appendChild(button);
  };

  /**
   * Creates a sphere and maps a video texture inside.
   * @param  { object } sources 'url'
   * @param { string } type media type
   * @param  { object } container {elementObject}
   * @param { object } config object
   * @return { object } THREE.Mesh
   */
  createVideo = function (sources, type, container, config) {
    let geometry = {},
      isValid = false,
      mesh = {};

    isValid = typeof sources === 'object' &&
      typeof type === 'string' &&
      typeof container === 'object';

    GEILDANKEVR.utils.errorChecker(isValid);

    geometry = new THREE.SphereGeometry(500, 60, 40);
    video = document.createElement('video');

    video.loop = true;
    video.setAttribute('webkit-playsinline', 'webkit-playsinline');

    video = createVideoPlayHandling(container);
    createVideoSources(sources);

    // Handle Video Mute here because it has to be done before video creation
    if (typeof config.single.optionalConfig === 'object') {
      handleOptionalVideoMute(config.single.optionalConfig);
    }

    videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.NearestFilter;
    videoTexture.maxFilter = THREE.NearestFilter;
    videoTexture.format = THREE.RGBFormat;
    videoTexture.generateMipmaps = false;
    videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture.repeat.set(1, 1);

    geometry.scale(-1, 1, 1);

    videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    mesh = new THREE.Mesh(geometry, videoMaterial);

    return mesh;
  };

  /**
   * Add autoplay settings for video
   * @param { object } container {elementObject}
   * @return { object } video
   */
  createVideoPlayHandling = function (container) {
    if (GEILDANKEVR.mobileDetection.isMobile()) {
      addVideoPlayButton();

      container.addEventListener('click', function () {
        removeVideoPlayButton();
        video.play();
      });
    } else {
      video.play();
    }
    return video;
  };

  /**
   * Create multiple video sources depending on user config
   * @param  { object } sources video sources config object
   * @return { void }
   */
  createVideoSources = function (sources) {
    Object.keys(sources).forEach(function (key) {
      let obj = sources[key],
        sourceElement = document.createElement('source');

      sourceElement.setAttribute('src', obj);
      sourceElement.setAttribute('type', 'video/' + key);
      video.appendChild(sourceElement);
    });
  };

  /**
   * Creates a VR sphere for 360° images
   * and returns it.
   * @param { string } texturePath: path to the texture map
   * @return { object } THREE.Mesh
   */
  createVRSphere = function (texturePath) {
    let geometry = {},
      isValid = false,
      material = {},
      texture = {},
      vrSphere = {};

    isValid = typeof texturePath === 'string';

    GEILDANKEVR.utils.errorChecker(isValid);

    geometry = new THREE.SphereGeometry(500, 60, 40);

    texture = new THREE.TextureLoader().load(texturePath);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    material = new THREE.MeshBasicMaterial({
      map: texture
    });

    vrSphere = new THREE.Mesh(geometry, material);
    vrSphere.scale.set(-1, 1, 1);

    return vrSphere;
  };

  /**
   * End automatic animation
   * @return { void }
   */
  endAnimation = function () {
    GEILDANKEVR.stage.deregisterAnimation('AUTO_ROTATION');
  };

  /**
   * Returns the animation speed, depending on the user config
   * If there is no user config, DEFAULT_ANIMATION_SPEED is used
   * @param  { number } animationSpeed config.animationSpeed
   * @return { number } animationSpeed in degree per second
   */
  handleOptionalAnimationSpeed = function (animationSpeed) {
    // default animation speed in degree per second
    let animationSpeedDPS = DEFAULT_ANIMATION_SPEED;

    if (animationSpeed && typeof animationSpeed === 'number') {
      animationSpeedDPS = animationSpeed;
    }

    return animationSpeedDPS;
  };

  /**
   * Handle possible optional configurations
   * @param  { object } config object
   * @return { void }
   */
  handleOptionalConfig = function (config) {
    handleOptionalIsAnimation(config);
    handleOptionalStartRotation(config);
    handleOptionalClearColor(config);
    handleOptionalVideoPoster(config);
  };

  /**
   * Check if an optional clear color was set
   * and change renderer if true
   * @param  { object } config object
   * @return { void }
   */
  handleOptionalClearColor = function (config) {
    let clearColor = null;

    if (typeof config.clearColor === 'string') {
      clearColor = config.clearColor.toString(16);
      clearColor = new THREE.Color(clearColor);
      GEILDANKEVR.stage.setClearColor(clearColor);
    }
  };

  /**
   * Check if optional animation was activated.
   * @param  { object } config object
   * @return { void }
   */
  handleOptionalIsAnimation = function (config) {
    let animationSpeed = 0,
      isValid = false;

    isValid = typeof config === 'object';

    GEILDANKEVR.utils.errorChecker(isValid);

    animationSpeed = handleOptionalAnimationSpeed(config.animationSpeed);

    if (config.isAnimation === true &&
       // do not activate animation on movile
      GEILDANKEVR.mobileDetection.isMobile() === false &&
       // do not activate animation when vr mode is active
      GEILDANKEVR.utils.getVrDisplayMode() === false) {
      startAnimation(animationSpeed);
    }
  };

  /**
   * Check if optional start rotation was set
   * @param  { object } config object
   * @return { void }
   */
  handleOptionalStartRotation = function (config) {
    if (typeof config.startRotation === 'number') {
      GEILDANKEVR.stage.setLookAt(config.startRotation);
    }
  };

  /**
   * Check if video should be muted
   * @param  { object } config object
   * @return { void }
   */
  handleOptionalVideoMute = function (config) {
    if (typeof config.videoMuted === 'boolean' &&
      config.videoMuted === true) {
      video.muted = true;
      video.setAttribute('muted', 'true');
    }
    if (typeof config.videoMuted === 'boolean' &&
      config.videoMuted === false) {
      video.muted = false;
    }
  };

  /**
   * Check if a video poster was set
   * @param  { object } config object
   * @return { void }
   */
  handleOptionalVideoPoster = function (config) {
    if (typeof config.videoPoster === 'string') {
      video.setAttribute('poster', config.videoPoster);
    }
  };

  /**
   * Hand vr display mode change
   * @return { void }
   */
  handleVrDisplayModeChange = function () {
    if (GEILDANKEVR.utils.getVrDisplayMode() === true) {
      endAnimation();
    } else {
      startAnimation();
    }
  };

  /**
   * Destroys the video, its texture and material
   * @return { void }
   */
  removeVideo = function () {
    video.pause();
    video.src = '';
    video.remove();
    video = null;
    videoTexture.dispose();
    videoMaterial.dispose();
  };

  /**
   * Removes the video play icon from the DOM
   * @return { void }
   */
  removeVideoPlayButton = function () {
    let button = {};

    button = document.getElementById(VIDEO_PLAY_BUTTON_ID);
    button.parentNode.removeChild(button);
  };

  /**
   * Start automatic animation
   * @param { number } animationSpeed the animation speed in degree per second
   * @return { void }
   */
  startAnimation = function (animationSpeed) {
    let clock = 0,
      delta = 0;

    GEILDANKEVR.stage.registerAnimation('AUTO_ROTATION', () => {
      let stage = GEILDANKEVR.stage.getStage(),
        y = stage.dolly.rotation.y;

      // has to be called within the render loop
      // rotates xx degree per second
      clock = GEILDANKEVR.stage.getStage().clock;
      delta = clock.getDelta();
      stage.dolly.rotation.y = y - delta * Math.PI / 180 * animationSpeed;
    });
  };

  /**
   * Creates a 360 degree sphere for videos or images.
   * @param  { object } stage {camera: {}, controls: {}, manager: {}, scene: {}}
   * @param  { object } config { mediaType: '', url: '', container: {elementObject} }
   * @return { void }
   */
  SCOPE.init = function (stage, config) {
    let camera = {},
      container = {},
      createObjects = {},
      isValid = false,
      mediaObject = {},
      mediaType = {},
      scene = {},
      texture = {};

    isValid = typeof stage.camera === 'object' &&
      typeof stage.scene === 'object' &&
      typeof config.container === 'object' &&
      typeof config.single === 'object' &&
      typeof config.single.mediaType === 'string';

    GEILDANKEVR.utils.errorChecker(isValid);

    camera = stage.camera;
    container = config.container;
    mediaType = config.single.mediaType;
    scene = stage.scene;
    texture = config.single.url;

    createObjects = {
      image: function () {
        mediaObject = createVRSphere(texture);
        scene.add(mediaObject);
      },
      video: function () {
        camera.layers.enable(1);
        mediaObject = createVideo(texture, 'left', container, config);
        scene.add(mediaObject);
        mediaObject = createVideo(texture, 'right', container, config);
        scene.add(mediaObject);
      }
    };

    createObjects[mediaType]();

    if (typeof config.single.optionalConfig === 'object') {
      handleOptionalConfig(config.single.optionalConfig);
    }

    window.addEventListener('vrdisplaypresentchange', function (e) {
      handleVrDisplayModeChange(e);
    });
  };

  /**
   * Destroys video, ends animation
   * @return { void }
   */
  SCOPE.destroy = function () {
    endAnimation();
    if (video !== null) {
      removeVideo();
    }
  };

  // PRIVATE START
  SCOPE.endAnimation = endAnimation;
  SCOPE.handleOptionalAnimationSpeed = handleOptionalAnimationSpeed;
  SCOPE.handleOptionalStartRotation = handleOptionalStartRotation;
  SCOPE.removeVideo = removeVideo;
  SCOPE.startAnimation = startAnimation;
  SCOPE.createVideoPlayHandling = createVideoPlayHandling;
  SCOPE.addVideoPlayButton = addVideoPlayButton;
  // PRIVATE END

  return SCOPE;
}());
