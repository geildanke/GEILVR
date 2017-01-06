'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

window.GEILDANKEVR = function () {
  var SCOPE = {};

  /**
   * Creates a stage and its content for a single full canvas 360 degree video or image.
   * @param { object } config { mediaType: '', url: '', container: {elementObject} }
   * @return { void }
   */
  SCOPE.single = function (config) {
    var isValid = false,
        stage = {};

    isValid = _typeof(config.container) === 'object' && (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object';

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
    var isValid = false,
        stage = {};

    isValid = _typeof(config.container) === 'object' && _typeof(config.singles) === 'object';

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
}();
'use strict';

window.GEILDANKEVR.content = function () {
  var SCOPE = {};

  /**
   * Creates the content for a stage, e.g.
   * - single image
   * - single video
   * - gallery
   * @param  { string } contentType 'single' or 'gallery'
   * @param  { object } stage {camera: {}, controls: {}, manager: {}, scene: {}}
   * @param  { object } config { mediaType: '', url: '', container: {elementObject} }
   * @return { void }
   */
  SCOPE.init = function (contentType, stage, config) {
    var createObjects = void 0;

    createObjects = {
      single: function single() {
        GEILDANKEVR.content.single.init(stage, config);
      },
      gallery: function gallery() {
        GEILDANKEVR.content.gallery.init(stage, config);
      }
    };

    createObjects[contentType]();
  };

  return SCOPE;
}();
'use strict';

window.GEILDANKEVR.assets = function () {
  var SCOPE = {};

  /**
   * Returns the data URI of a white play icon
   * @return { string } data uri string
   */
  SCOPE.getIconPlayWhite = function () {
    /* eslint-disable max-len */
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAABl0lEQVR4Ae2XveraUBiHY4xD3URx8F+9gHZW9EKEOgi9Cz8uQFtXiwRsobvgIoLXIfYCKrqoaadCk+Xp4HiSc15PQkvB512FB37xvB/Ok/8BXDqMWXMgICIi4MCaEW1cHFOZftBgxpkkTnygbi+osiTCRIhPxUbQ5wdSAnqPCQp84VF8PKmgyA4bthQlggI7bNnimQWfSYNvEvRJyzudoMpP0nKjnCxYkgWLJEFD+6ze8wsZIS/xghk6HN7wDRnTOIHLGR33F/IVCUdyqqCDHudewqhaqmAsEwijGqqCtUwgjGqlCg4ygTCqvSoIZAJhVFdVEMkEwqjCvyiwj+gt8oiy/8j/4G86QosSjZ6BKmhn2iqaqsDllFmz+x7X7Bw+ouMejYxJ/DyoZzRwflNLGpk+WTBPnskVAtJyoaRbW3qkpWtavHzS8Mm82XlssWVDXrb82ik2vJKu7x6+RTj5xw6QHjekXOjanFBlFoSCZzWnZH8EvmbKUdNzJtQER6ChXFoMWbHnSkjIlT0rBjTJyc/Y7OspkNYf1H6eRU02jH0AAAAASUVORK5CYII=';
    /* eslint-enable max-len */
  };

  return SCOPE;
}();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

window.GEILDANKEVR.content.gallery = function () {
  var SCOPE = {},
      createAnimationCrosshairRaycaster = {},
      createAnimationPointerRaycaster = {},
      createContent = {},
      createCrosshair = {},
      createHouse = {},
      createNavigation = {},
      createPlane = {},
      createRaycaster = {},
      createRoom = {},
      createSIF = {},
      createSingleThumb = {},
      createTerrain = {},
      createTexture = {},
      createTree = {},
      createWallWithWindow = {},
      createWorld = {},
      crosshair = {},
      endThumbAnimation = {},
      handleIntersection = {},
      startThumbAnimation = {},
      thumbsContainer = {};

  /**
   * Creates new SIF based on direction set in the config
   * @param  { object } config { direction: 'left|right' }
   * @return { object } Mesh that represents SIF
   */
  createSIF = function createSIF(config) {
    var defaults = {
      color: {
        idle: 0x21b6a8,
        error: 0xee1515
      }
    },
        geometry = {},
        material = {},
        sif = {};

    geometry = new THREE.PlaneGeometry(0.8, 3);
    material = new THREE.MeshPhongMaterial({
      color: defaults.color.idle,
      shading: THREE.FlatShading,
      shininess: 60,
      transparent: true,
      opacity: 0.2
    });

    sif = new THREE.Mesh(geometry, material);

    sif.state = {
      mode: 'idle'
    };

    if (config.direction === 'right') {
      sif.sign = 1;
    } else {
      sif.sign = -1;
    }

    sif.rotation.y = -Math.PI / 2 * sif.sign;
    sif.name = config.name;

    sif.setMode = function (mode) {
      var allowedModes = ['scroll', 'error', 'idle'],
          modeSetup = {};

      if (this.state.mode === mode || allowedModes.indexOf(mode) < 0) {
        return;
      }

      this.state.mode = mode;

      modeSetup = {
        scroll: {
          opacity: 0.6,
          color: new THREE.Color(defaults.color.idle)
        },
        idle: {
          opacity: 0.2,
          color: new THREE.Color(defaults.color.idle)
        },
        error: {
          opacity: 0.6,
          color: new THREE.Color(defaults.color.error)
        }
      };

      this.material.opacity = modeSetup[mode].opacity;
      this.material.color = modeSetup[mode].color;
    };

    return sif;
  };

  /**
   * Creates crosshair for the camera
   * @return { void }
   */
  createCrosshair = function createCrosshair() {
    var camera = void 0,
        geometry = new THREE.RingGeometry(0.001, 0.002, 16),
        material = new THREE.MeshBasicMaterial({ color: 0xAAFFAA, side: THREE.DoubleSide }),
        mouse3d = GEILDANKEVR.utils.getMouse3d();

    camera = GEILDANKEVR.stage.getStage().camera;
    crosshair = new THREE.Mesh(geometry, material);

    crosshair.position.x = 0;
    crosshair.position.y = 0;
    crosshair.position.z = -0.2;

    if (GEILDANKEVR.mobileDetection.isMobile() === true) {
      camera.add(crosshair);
    } else {
      GEILDANKEVR.stage.registerAnimation('CROSSHAIR_POINTER', function () {
        crosshair.position.set(mouse3d.x, mouse3d.y, mouse3d.z);
        GEILDANKEVR.stage.getStage().scene.add(crosshair);
      });
    }
  };

  /**
   * Handle intersection with set objects
   * @param  { array } intersects array representing objects that are being intersected
   * @param { number } delay before triggering the start animation function
   * @return { void }
   */
  handleIntersection = function handleIntersection(intersects, delay) {
    for (var i = 0, max = intersects.length; i < max; i = i + 1) {
      var element = intersects[i];

      GEILDANKEVR.utils.handleLookat({
        element: element,
        lookAt: startThumbAnimation,
        lookAtArguments: {
          sign: element.object.sign,
          object: element.object
        },
        lookAway: endThumbAnimation,
        lookAwayArguments: {
          sign: element.object.sign,
          object: element.object
        },
        delay: delay
      });
    }
  };

  /**
   * Creates a house around the gallery room
   * @return { void }
   */
  createHouse = function createHouse() {
    var house = {},
        wallLeft = {},
        wallRight = {},
        wallGeometry = {},
        wallMaterial = {};

    wallGeometry = new THREE.BoxGeometry(40, 4, 10);
    wallMaterial = new THREE.MeshLambertMaterial({
      color: 0xf7f7f7
    });

    wallLeft = new THREE.Mesh(wallGeometry, wallMaterial);
    wallLeft.receiveShadow = true;
    wallLeft.position.x = 25;
    wallLeft.position.y = 2;
    wallLeft.position.z = -7;

    wallRight = new THREE.Mesh(wallGeometry, wallMaterial);
    wallRight.receiveShadow = true;
    wallRight.position.x = -25;
    wallRight.position.y = 2;
    wallRight.position.z = -7;

    house = new THREE.Object3D();
    house.add(wallLeft, wallRight);

    return house;
  };

  /**
   * Creates camera raycaster and registers it to detect intersection with set objects
   * @param  { array } objects array representing objects that react to gaze
   * @return { void }
   */
  createRaycaster = function createRaycaster(objects) {
    if (GEILDANKEVR.mobileDetection && GEILDANKEVR.mobileDetection.isMobile() === true) {
      createAnimationCrosshairRaycaster(objects);
    } else {
      createAnimationPointerRaycaster(objects);
    }
  };

  /**
   * Creates a plane below the gallery room holding the environment
   * @return { void }
   */
  createPlane = function createPlane() {
    var plane = {},
        planeGeometry = {},
        planeMaterial = {};

    planeGeometry = new THREE.CylinderGeometry(1000, 1000, 1, 100);
    planeMaterial = new THREE.MeshLambertMaterial({
      color: 0x596c6a
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.position.y = -0.1;

    return plane;
  };

  /**
   * Creates a single tree
   * @param { number } x integer value of tree's position
   * @param { number } z integer value of tree's position
   * @return { object } tree mesh object
   */
  createTree = function createTree(x, z) {
    var cone = {},
        coneGeometry = {},
        coneMaterial = {},
        crownHeight = 0,
        crownWidth = 0,
        cylinder = {},
        cylinderGeometry = {},
        cylinderMaterial = {},
        stemHeight = 0,
        stemWidth = 0;

    crownHeight = GEILDANKEVR.utils.getRandomGauss(4, 8, 1);
    crownWidth = crownHeight * (Math.random() * 0.21 + 0.3);
    stemHeight = crownHeight * 0.25;
    stemWidth = stemHeight * 0.3;

    coneGeometry = new THREE.CylinderGeometry(0, crownWidth, crownHeight, 8);
    coneMaterial = new THREE.MeshLambertMaterial({
      color: 0x4db6ac,
      shading: THREE.FlatShading
    });
    cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.set(x, crownHeight * 0.5 + stemHeight, z);

    cylinderGeometry = new THREE.CylinderGeometry(stemWidth, stemWidth, stemHeight, 5);
    cylinderMaterial = new THREE.MeshLambertMaterial({
      color: 0x5D4037
    });
    cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(0, -stemHeight * 2.5, 0);

    cone.add(cylinder);
    cone.castShadow = true;
    cone.receiveShadow = true;

    return cone;
  };

  /**
   * Create trees, house and plane
   * @return { void }
   */
  createTerrain = function createTerrain() {
    var environment = {},
        house = {},
        plane = {};

    plane = createPlane();
    house = createHouse();
    environment = new THREE.Object3D();

    // create trees behind gallery
    for (var i = 0; i < 200; i = i + 1) {
      var tree = {},
          x = GEILDANKEVR.utils.getRandomInteger(-50, 50),
          z = GEILDANKEVR.utils.getRandomInteger(10, 50); // plant trees only behind the gallery room

      tree = createTree(x, z);
      environment.add(tree);
    }

    // create trees left of gallery
    for (var _i = 0; _i < 25; _i = _i + 1) {
      var _tree = {},
          _x = GEILDANKEVR.utils.getRandomInteger(-60, -20),
          _z = GEILDANKEVR.utils.getRandomInteger(-10, 10);

      _tree = createTree(_x, _z);
      environment.add(_tree);
    }

    // create trees right of gallery
    for (var _i2 = 0; _i2 < 25; _i2 = _i2 + 1) {
      var _tree2 = {},
          _x2 = GEILDANKEVR.utils.getRandomInteger(20, 60),
          _z2 = GEILDANKEVR.utils.getRandomInteger(-10, 10);

      _tree2 = createTree(_x2, _z2);
      environment.add(_tree2);
    }

    environment.add(plane, house);

    GEILDANKEVR.stage.getStage().scene.add(environment);
  };

  /**
   * Casts a ray from camera
   * @param  { object } objects to intersect with
   * @return { void }
   */
  createAnimationCrosshairRaycaster = function createAnimationCrosshairRaycaster(objects) {
    var camera = GEILDANKEVR.stage.getStage().camera,
        currentlyIntersecting = false,
        raycaster = new THREE.Raycaster();

    GEILDANKEVR.stage.registerAnimation('BUTTON_RAYCASTER', function () {
      var direction = {},
          intersects = [],
          origin = {};

      origin = camera.getWorldPosition();
      direction = camera.getWorldDirection();

      raycaster.set(origin, direction);
      intersects = raycaster.intersectObjects(objects);

      if (!currentlyIntersecting) {
        handleIntersection(intersects, 1000);
      }

      currentlyIntersecting = intersects.length !== 0;
    });
  };

  /**
   * Casts a ray between mouse and camera
   * @param  { object } objects to intersect with
   * @return { void }
   */
  createAnimationPointerRaycaster = function createAnimationPointerRaycaster(objects) {
    var camera = GEILDANKEVR.stage.getStage().camera,
        currentlyIntersecting = false,
        raycaster = new THREE.Raycaster();

    GEILDANKEVR.stage.registerAnimation('BUTTON_RAYCASTER', function () {
      var intersects = [];

      raycaster.setFromCamera(GEILDANKEVR.utils.getMouse2d(), camera);
      intersects = raycaster.intersectObjects(objects);
      if (!currentlyIntersecting) {
        handleIntersection(intersects, 10);
      }

      currentlyIntersecting = intersects.length !== 0;
    });
  };

  /**
   * Creates thumbs gallery
   * @param  { array } singles array representing objects that describe thumbs
   * @return { object } object group containing thumbs
   */
  createContent = function createContent(singles) {
    var galleryWall = {},
        minOffset = 0,
        spaceBetweenThumbs = 0.2,
        thumbWidth = 2;

    galleryWall = new THREE.Object3D();
    for (var i = 0, max = singles.length; i < max; i = i + 1) {
      var params = {},
          single = {};

      params = {
        thumbWidth: thumbWidth,
        spaceBetweenThumbs: spaceBetweenThumbs
      };

      single = createSingleThumb(singles[i], i, max, params);
      galleryWall.add(single);
    }

    minOffset = -(singles.length - 1) * (thumbWidth + spaceBetweenThumbs);

    galleryWall.scrollOffset = {
      current: 0,
      min: minOffset,
      max: 0
    };

    return galleryWall;
  };

  /**
   * Creates two scrolling interaction fields and positions the properly
   * @return { object } object group containing navigation
   */
  createNavigation = function createNavigation() {
    var buttonGroup = {},
        buttonLeft = {},
        buttonRight = {};

    buttonGroup = new THREE.Object3D();
    buttonLeft = createSIF({ direction: 'left' });
    buttonRight = createSIF({ direction: 'right' });
    buttonLeft.position.set(-1, 1.2, -1);
    buttonRight.position.set(1, 1.2, -1);

    buttonGroup.add(buttonLeft, buttonRight);

    createRaycaster([buttonLeft, buttonRight]);

    return buttonGroup;
  };

  /**
   * Creates a single thumb
   * @param  { object } config {url: ''}
   * @param  { number } index curren thumb's index
   * @param  { number } count count of all thumbs
   * @param  { object } params distance parameters {spaceBetweenThumbs: 0.2, thumbWidth: 2}
   * @return { object } Mesh of the thumb
   */
  createSingleThumb = function createSingleThumb(config, index, count, params) {
    var geometry = {},
        material = {},
        mesh = {},
        spaceBetweenThumbs = params.spaceBetweenThumbs,
        texture = {},
        thumbWidth = params.thumbWidth,
        xOffset = 0;

    // Calculation of position.x of each thumb
    // depending on thumb width, space between the thumbs,
    // count of thumbs and its index.
    xOffset = (thumbWidth + spaceBetweenThumbs) * index;
    geometry = new THREE.BoxGeometry(thumbWidth, thumbWidth, 0.025);
    texture = createTexture(config.url, 1024);
    material = new THREE.MeshPhongMaterial({ map: texture });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(xOffset, 1.6, -2.45);
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    return mesh;
  };

  /**
   * Loads texture from url
   * @param { string } url url of the texture
   * @param { number } fit size of the object to fit
   * @return { object } texture
   */
  createTexture = function createTexture(url, fit) {
    var repeatX = void 0,
        repeatY = void 0,
        texture = {};

    texture = new THREE.TextureLoader().load(url, function () {
      if (fit) {
        repeatX = texture.image.naturalHeight / texture.image.naturalWidth;

        if (repeatX > 1) {
          repeatY = 1 / repeatX;
          repeatX = 1;
          texture.repeat.set(repeatX, repeatY);
          texture.offset.y = (repeatY - 1) / 2 * -1;
        } else {
          repeatY = 1;
          texture.repeat.set(repeatX, repeatY);
          texture.offset.x = (repeatX - 1) / 2 * -1;
        }
      }
    });

    if (fit) {
      texture.wrapT = THREE.RepeatWrapping;
      texture.wrapS = THREE.RepeatWrapping;
    } else {
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.wrapS = THREE.ClampToEdgeWrapping;
    }

    return texture;
  };

  /**
   * Creates wall with given parameters and transparent
   * window in the middle.
   * @param { float } wallWidth width of the wall
   * @param { float } windowWidth width of the window
   * @param { object } material material for the wall
   * @param { number } fit size of the object to fit
   * @return { object } wall
   */
  createWallWithWindow = function createWallWithWindow(wallWidth, windowWidth, material) {
    var glassPane = void 0,
        sideWidth = (wallWidth - windowWidth) / 2,
        transparentMaterial = new THREE.MeshBasicMaterial({
      color: 0x9dcbc7,
      transparent: true,
      opacity: 0.3
    }),
        wall = new THREE.Object3D(),
        wallLeft = void 0,
        wallRight = void 0;

    wallLeft = new THREE.Mesh(new THREE.BoxGeometry(sideWidth, 2.5, 0.2), material);
    wallLeft.position.set(-windowWidth / 2 - sideWidth / 2, 0, 0);
    wallRight = new THREE.Mesh(new THREE.BoxGeometry(sideWidth, 2.5, 0.2), material);
    wallRight.position.set(windowWidth / 2 + sideWidth / 2, 0, 0);
    glassPane = new THREE.Mesh(new THREE.BoxGeometry(windowWidth, 2.5, 0.2), transparentMaterial);
    glassPane.position.set(0, 0, 0);

    wall.add(wallLeft, wallRight, glassPane);
    return wall;
  };

  /**
   * Creates a room for the user.
   * @param { object } objectGroup three.js object to add meshes to
   * @param { object } material material for the wall
   * @return { void }
   */
  createRoom = function createRoom(objectGroup, material) {
    var floor = void 0,
        wall1 = void 0,
        wall2 = void 0,
        wall3 = void 0;

    wall1 = createWallWithWindow(6, 5, material);
    wall1.rotation.z = Math.PI;
    wall1.position.set(0, 2, 1.4);

    wall2 = createWallWithWindow(3, 2.25, material);
    wall2.rotation.y = Math.PI / 2;
    wall2.position.set(-3, 2, -0);

    wall3 = createWallWithWindow(3, 2.25, material);
    wall3.rotation.y = -Math.PI / 2;
    wall3.position.set(3, 2, -0);

    floor = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 0.3), material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0.75, 0);

    objectGroup.add(wall1, wall2, wall3, floor);
  };

  /**
   * Creates the room and lightning
   * @return { object } object group with all room elements
   */
  createWorld = function createWorld() {
    var lights = [],
        objectGroup = {},
        sky = void 0,
        wallGeometry = new THREE.BoxGeometry(12, 4, 1),
        wallMaterial = void 0,
        wallMesh = void 0;

    objectGroup = new THREE.Object3D();

    wallMaterial = new THREE.MeshPhongMaterial({
      shininess: 2
    });

    wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.set(0, 2, -3);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;

    sky = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshBasicMaterial({ color: 0xabdcfb, side: THREE.BackSide, fog: false }));

    lights[0] = new THREE.PointLight(0xffffff, 0.75);
    lights[0].position.set(0, 3, 0);
    lights[0].castShadow = true;

    lights[1] = new THREE.AmbientLight(0x444444);
    lights[1].position.set(0, 0, 0);

    createRoom(objectGroup, wallMaterial);
    createTerrain();

    objectGroup.add(wallMesh);
    objectGroup.add(lights[0], lights[1], sky);

    return objectGroup;
  };

  /**
   * Stops scrolling animation for thumbnails, removes it from animation loop
   * @param  { object } config various parameters for scrolling animation
   * @return { void }
   */
  endThumbAnimation = function endThumbAnimation(config) {
    config.object.setMode('idle');

    GEILDANKEVR.stage.deregisterAnimation('THUMBS_SCROLLING');
  };

  /**
   * Starts scrolling animation for thumbnails
   * @param  { object } config various parameters for scrolling animation
   * @return { void }
   */
  startThumbAnimation = function startThumbAnimation(config) {
    var speed = -0.015 * config.sign;

    GEILDANKEVR.stage.registerAnimation('THUMBS_SCROLLING', function () {
      var offset = thumbsContainer.scrollOffset,
          x = thumbsContainer.position.x;

      if (offset.current + speed < offset.max && offset.current + speed > offset.min) {
        offset.current = offset.current + speed;
        thumbsContainer.position.x = x + speed;
        config.object.setMode('scroll');
      } else {
        config.object.setMode('error');
      }
    });
  };

  /**
   * Initialize Scene
   * @param  { object } stage object
   * @param  { object } config object
   * @return { void }
   */
  SCOPE.init = function (stage, config) {
    var isValid = false,
        scene = {},
        singles = [],
        ui = {},
        world = {};

    isValid = _typeof(config.container) === 'object' && _typeof(stage.scene) === 'object' && _typeof(config.singles) === 'object';

    GEILDANKEVR.utils.errorChecker(isValid);

    scene = stage.scene;
    singles = config.singles;

    thumbsContainer = createContent(singles);
    world = createWorld();
    ui = createNavigation();
    createCrosshair();

    scene.fog = new THREE.Fog(0xcccccc, 5, 50);
    scene.add(thumbsContainer, world, ui);
  };

  // PRIVATE START
  SCOPE.createSingleThumb = createSingleThumb;
  SCOPE.createSIF = createSIF;
  SCOPE.handleIntersection = handleIntersection;
  SCOPE.createRaycaster = createRaycaster;
  SCOPE.endThumbAnimation = endThumbAnimation;
  SCOPE.startThumbAnimation = startThumbAnimation;
  SCOPE.createTexture = createTexture;
  // PRIVATE END

  return SCOPE;
}();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

window.GEILDANKEVR.content.single = function () {
  var DEFAULT_ANIMATION_SPEED = 10,
      VIDEO_PLAY_BUTTON_ID = 'GEILDANKEVR-video-play';

  var SCOPE = {},
      addVideoPlayButton = void 0,
      createVRSphere = void 0,
      createVideo = void 0,
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
  addVideoPlayButton = function addVideoPlayButton() {
    var button = {},
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
  createVideo = function createVideo(sources, type, container, config) {
    var geometry = {},
        isValid = false,
        mesh = {};

    isValid = (typeof sources === 'undefined' ? 'undefined' : _typeof(sources)) === 'object' && typeof type === 'string' && (typeof container === 'undefined' ? 'undefined' : _typeof(container)) === 'object';

    GEILDANKEVR.utils.errorChecker(isValid);

    geometry = new THREE.SphereGeometry(500, 60, 40);
    video = document.createElement('video');

    video.loop = true;
    video.setAttribute('webkit-playsinline', 'webkit-playsinline');

    video = createVideoPlayHandling(container);
    createVideoSources(sources);

    // Handle Video Mute here because it has to be done before video creation
    if (_typeof(config.single.optionalConfig) === 'object') {
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
  createVideoPlayHandling = function createVideoPlayHandling(container) {
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
  createVideoSources = function createVideoSources(sources) {
    Object.keys(sources).forEach(function (key) {
      var obj = sources[key],
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
  createVRSphere = function createVRSphere(texturePath) {
    var geometry = {},
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
  endAnimation = function endAnimation() {
    GEILDANKEVR.stage.deregisterAnimation('AUTO_ROTATION');
  };

  /**
   * Returns the animation speed, depending on the user config
   * If there is no user config, DEFAULT_ANIMATION_SPEED is used
   * @param  { number } animationSpeed config.animationSpeed
   * @return { number } animationSpeed in degree per second
   */
  handleOptionalAnimationSpeed = function handleOptionalAnimationSpeed(animationSpeed) {
    // default animation speed in degree per second
    var animationSpeedDPS = DEFAULT_ANIMATION_SPEED;

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
  handleOptionalConfig = function handleOptionalConfig(config) {
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
  handleOptionalClearColor = function handleOptionalClearColor(config) {
    var clearColor = null;

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
  handleOptionalIsAnimation = function handleOptionalIsAnimation(config) {
    var animationSpeed = 0,
        isValid = false;

    isValid = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object';

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
  handleOptionalStartRotation = function handleOptionalStartRotation(config) {
    if (typeof config.startRotation === 'number') {
      GEILDANKEVR.stage.setLookAt(config.startRotation);
    }
  };

  /**
   * Check if video should be muted
   * @param  { object } config object
   * @return { void }
   */
  handleOptionalVideoMute = function handleOptionalVideoMute(config) {
    if (typeof config.videoMuted === 'boolean' && config.videoMuted === true) {
      video.muted = true;
      video.setAttribute('muted', 'true');
    }
    if (typeof config.videoMuted === 'boolean' && config.videoMuted === false) {
      video.muted = false;
    }
  };

  /**
   * Check if a video poster was set
   * @param  { object } config object
   * @return { void }
   */
  handleOptionalVideoPoster = function handleOptionalVideoPoster(config) {
    if (typeof config.videoPoster === 'string') {
      video.setAttribute('poster', config.videoPoster);
    }
  };

  /**
   * Hand vr display mode change
   * @return { void }
   */
  handleVrDisplayModeChange = function handleVrDisplayModeChange() {
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
  removeVideo = function removeVideo() {
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
  removeVideoPlayButton = function removeVideoPlayButton() {
    var button = {};

    button = document.getElementById(VIDEO_PLAY_BUTTON_ID);
    button.parentNode.removeChild(button);
  };

  /**
   * Start automatic animation
   * @param { number } animationSpeed the animation speed in degree per second
   * @return { void }
   */
  startAnimation = function startAnimation(animationSpeed) {
    var clock = 0,
        delta = 0;

    GEILDANKEVR.stage.registerAnimation('AUTO_ROTATION', function () {
      var stage = GEILDANKEVR.stage.getStage(),
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
    var camera = {},
        container = {},
        createObjects = {},
        isValid = false,
        mediaObject = {},
        mediaType = {},
        scene = {},
        texture = {};

    isValid = _typeof(stage.camera) === 'object' && _typeof(stage.scene) === 'object' && _typeof(config.container) === 'object' && _typeof(config.single) === 'object' && typeof config.single.mediaType === 'string';

    GEILDANKEVR.utils.errorChecker(isValid);

    camera = stage.camera;
    container = config.container;
    mediaType = config.single.mediaType;
    scene = stage.scene;
    texture = config.single.url;

    createObjects = {
      image: function image() {
        mediaObject = createVRSphere(texture);
        scene.add(mediaObject);
      },
      video: function video() {
        camera.layers.enable(1);
        mediaObject = createVideo(texture, 'left', container, config);
        scene.add(mediaObject);
        mediaObject = createVideo(texture, 'right', container, config);
        scene.add(mediaObject);
      }
    };

    createObjects[mediaType]();

    if (_typeof(config.single.optionalConfig) === 'object') {
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
}();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

window.GEILDANKEVR.globalEvents = function () {
  var SCOPE = {},
      handleVrDisplayChange = {};

  handleVrDisplayChange = function handleVrDisplayChange(e) {
    var isValid = false;

    isValid = (typeof e === 'undefined' ? 'undefined' : _typeof(e)) === 'object' && _typeof(e.detail) === 'object' && _typeof(e.detail.vrdisplay) === 'object' && typeof e.detail.vrdisplay.isPresenting === 'boolean';
    GEILDANKEVR.utils.errorChecker(isValid);

    GEILDANKEVR.utils.setVrDisplayMode(e.detail.vrdisplay.isPresenting);
  };

  window.addEventListener('vrdisplaypresentchange', handleVrDisplayChange);

  // PRIVATE START
  SCOPE.handleVrDisplayChange = handleVrDisplayChange;
  // PRIVATE END

  return SCOPE;
}();
'use strict';

window.GEILDANKEVR.mobileDetection = function () {
  var SCOPE = {};

  /* eslint-disable complexity, max-len, wrap-iife, space-before-function-paren,
  space-before-blocks, brace-style, keyword-spacing, curly, space-infix-ops,
  wrap-regex, comma-spacing, semi */
  /**
   * [isMobile description]
   * @return {Boolean} [description]
   */
  SCOPE.isMobile = function () {
    var check = false;

    (function (a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);

    return check;
  };
  /* eslint-enable complexity, max-len, wrap-iife, space-before-function-paren,
  space-before-blocks, brace-style, keyword-spacing, curly, space-infix-ops,
  wrap-regex, comma-spacing, semi */

  return SCOPE;
}();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

window.GEILDANKEVR.stage = function () {
  var DEFAULT_COLOR_CLEAR = new THREE.Color(0x000000);

  var SCOPE = {},
      addListeners = void 0,
      _animate = void 0,
      createCamera = void 0,
      createCameraDolly = void 0,
      createControls = void 0,
      createRenderer = void 0,
      createScene = void 0,
      createVREffect = void 0,
      createVRManager = void 0,
      getCurrentContainerDimensions = void 0,
      makeContainerFullscreen = void 0,
      onFullscreenChange = void 0,
      onFullscreenEnd = void 0,
      onFullscreenStart = void 0,
      onResize = void 0,
      prepareDocument = void 0,
      requestAnimationFrameId = void 0,
      setCanvasDimensions = void 0,
      stage = {},
      undoContainerFullscreen = void 0,
      updateQueue = {};

  /**
   * Add event listeners for resize and vrdisplaypresentchange.
   * @param { object } container: DOM element of the canvas container
   * @param { object } camera: THREE.js camera object
   * @param { object } effect: THREE.js VR effect
   * @return { void }
   */
  addListeners = function addListeners(container, camera, effect) {
    var fullscreenEvents = ['webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'];

    window.addEventListener('resize', function () {
      onResize(container, camera, effect);
    }, true);
    window.addEventListener('vrdisplaypresentchange', function () {
      onResize(container, camera, effect);
    }, true);

    // Bind to fullscreen events.
    for (var i = 0, max = fullscreenEvents.length; i < max; i = i + 1) {
      document.addEventListener(fullscreenEvents[i], onFullscreenChange.bind(null, container, camera, effect), true);
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
  onFullscreenChange = function onFullscreenChange(container, camera, effect) {
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
  _animate = function animate(timestamp, controls, camera, manager, scene) {
    controls.update();
    manager.render(scene, camera, timestamp);
    Object.keys(updateQueue).forEach(function (key) {
      updateQueue[key]();
    });
    requestAnimationFrameId = requestAnimationFrame(function () {
      _animate(timestamp, controls, camera, manager, scene);
    });
  };

  /**
   * Creates a THREE.js perspective camera
   * and returns it.
   * @param { object } cameraContainer: DOM element of the canvas container
   * @return { object } THREE.PerspectiveCamera | object
   */
  createCamera = function createCamera(cameraContainer) {
    var camera = void 0,
        containerRatio = cameraContainer.offsetWidth / cameraContainer.offsetHeight;

    camera = new THREE.PerspectiveCamera(75, containerRatio, 0.1, 10000);
    return camera;
  };

  /**
   * Create a camera dolly for animations and rotation/position setting
   * @param  { object } camera object
   * @return { object } dolly THREE.Group object
   */
  createCameraDolly = function createCameraDolly(camera) {
    var dolly = {};

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
  createControls = function createControls(camera) {
    var controls = void 0;

    controls = new THREE.VRControls(camera);
    controls.standing = true;
    return controls;
  };

  /**
   * Create THREE.js WebGL renderer
   * and returns it.
   * @return { object } THREE.WebGLRenderer | object
   */
  createRenderer = function createRenderer() {
    var renderer = void 0;

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
  createScene = function createScene() {
    var scene = void 0;

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
  createVREffect = function createVREffect(renderer, container) {
    var effect = void 0;

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
  createVRManager = function createVRManager(renderer, effect, container) {
    var manager = void 0,
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
  getCurrentContainerDimensions = function getCurrentContainerDimensions(container) {
    var dimensions = {};

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
  makeContainerFullscreen = function makeContainerFullscreen(container) {
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
  onFullscreenEnd = function onFullscreenEnd(container, camera, effect) {
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
  onFullscreenStart = function onFullscreenStart(container, camera, effect) {
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
  onResize = function onResize(container, camera, effect) {
    var dimensions = {};

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
  prepareDocument = function prepareDocument() {
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
  setCanvasDimensions = function setCanvasDimensions(container, width, height) {
    var canvas = container.getElementsByTagName('canvas')[0];

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
  undoContainerFullscreen = function undoContainerFullscreen(container) {
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
    var camera = void 0,
        clock = void 0,
        controls = void 0,
        dolly = void 0,
        effect = void 0,
        isValid = void 0,
        manager = void 0,
        renderer = void 0,
        scene = void 0;

    isValid = (typeof container === 'undefined' ? 'undefined' : _typeof(container)) === 'object';

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
      _animate(timestamp, controls, camera, manager, scene);
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
    var yRotationRadian = GEILDANKEVR.utils.degreeToRadians(yRotationDegree);

    stage.dolly.rotation.y = yRotationRadian;
  };

  // PRIVATE START
  SCOPE.getCurrentContainerDimensions = getCurrentContainerDimensions;
  SCOPE.makeContainerFullscreen = makeContainerFullscreen;
  SCOPE.onFullscreenStart = onFullscreenStart;
  SCOPE.undoContainerFullscreen = undoContainerFullscreen;
  // PRIVATE END

  return SCOPE;
}();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

window.GEILDANKEVR.utils = function () {
  var SCOPE = {},
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
  createCrosshairRaycaster = function createCrosshairRaycaster(delayTimeout, object, callback) {
    var camera = {},
        lookatIntervalId = {},
        raycaster = {};

    raycaster = new THREE.Raycaster();
    camera = GEILDANKEVR.stage.getStage().camera;

    lookatIntervalId = window.setInterval(function () {
      var intersects = [];

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
  createPointerRaycaster = function createPointerRaycaster(delayTimeout, object, callback) {
    var camera = {},
        lookatIntervalId = {},
        raycaster = {};

    raycaster = new THREE.Raycaster();
    camera = GEILDANKEVR.stage.getStage().camera;

    lookatIntervalId = window.setInterval(function () {
      var intersects = [];

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
  getOrientation = function getOrientation() {
    var orientation = {};

    orientation = screen.orientation.type || screen.mozOrientation.type || screen.msOrientation.type;
    return orientation;
  };

  /**
   * Initialize utils
   * @return { void }
   */
  init = function init() {
    if (GEILDANKEVR.mobileDetection && GEILDANKEVR.mobileDetection.isMobile() === false) {
      document.addEventListener('mousemove', onMouseMove, false);
    }
  };

  /**
   * Get Mouse Position on MouseMove
   * @param  { object } event mousemove event
   * @return { void }
   */
  onMouseMove = function onMouseMove(event) {
    var camera = GEILDANKEVR.stage.getStage().camera,
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
    var height = 0,
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
    var rect = el.getBoundingClientRect(),
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
    var fullscreen = false;

    if (document.webkitFullscreenElement !== null && document.mozFullScreenElement !== null) {
      fullscreen = true;
    }
    return fullscreen;
  };

  /**
   * Returns a boolean depending user is in landscape mode or not
   * @return { Boolean } isLandscapeMode
   */
  SCOPE.isLandscapeMode = function () {
    var isLandscapeMode = false,
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
    var isPortraitMode = false,
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
    var delayTimeout = void 0,
        isValid = false;

    isValid = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && _typeof(config.element) === 'object' && typeof config.lookAt === 'function' && _typeof(config.lookAtArguments) === 'object' && typeof config.lookAway === 'function' && _typeof(config.lookAwayArguments) === 'object';

    GEILDANKEVR.utils.errorChecker(isValid);
    if (config.delay) {
      delayTimeout = setTimeout(function () {
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
}();
//# sourceMappingURL=geildankevr.js.map
