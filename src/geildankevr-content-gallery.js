'use strict';

window.GEILDANKEVR.content.gallery = (function () {
  let SCOPE = {},
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
  createSIF = function (config) {
    let defaults = {
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
      let allowedModes = ['scroll', 'error', 'idle'],
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
  createCrosshair = function () {
    let camera,
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
      GEILDANKEVR.stage.registerAnimation('CROSSHAIR_POINTER', () => {
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
  handleIntersection = function (intersects, delay) {
    for (let i = 0, max = intersects.length; i < max; i = i + 1) {
      let element = intersects[ i ];

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
  createHouse = function () {
    let house = {},
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
  createRaycaster = function (objects) {
    if (GEILDANKEVR.mobileDetection &&
        GEILDANKEVR.mobileDetection.isMobile() === true) {
      createAnimationCrosshairRaycaster(objects);
    } else {
      createAnimationPointerRaycaster(objects);
    }
  };

  /**
   * Creates a plane below the gallery room holding the environment
   * @return { void }
   */
  createPlane = function () {
    let plane = {},
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
  createTree = function (x, z) {
    let cone = {},
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
  createTerrain = function () {
    let environment = {},
      house = {},
      plane = {};

    plane = createPlane();
    house = createHouse();
    environment = new THREE.Object3D();
    
    // create trees behind gallery
    for (let i = 0; i < 200; i = i + 1) {
      let tree = {},
        x = GEILDANKEVR.utils.getRandomInteger(-50, 50),
        z = GEILDANKEVR.utils.getRandomInteger(10, 50); // plant trees only behind the gallery room

      tree = createTree(x, z);
      environment.add(tree);
    }

    // create trees left of gallery
    for (let i = 0; i < 25; i = i + 1) {
      let tree = {},
        x = GEILDANKEVR.utils.getRandomInteger(-60, -20),
        z = GEILDANKEVR.utils.getRandomInteger(-10, 10);

      tree = createTree(x, z);
      environment.add(tree);
    }

    // create trees right of gallery
    for (let i = 0; i < 25; i = i + 1) {
      let tree = {},
        x = GEILDANKEVR.utils.getRandomInteger(20, 60),
        z = GEILDANKEVR.utils.getRandomInteger(-10, 10);

      tree = createTree(x, z);
      environment.add(tree);
    }

    environment.add(plane, house);

    GEILDANKEVR.stage.getStage().scene.add(environment);
  };

  /**
   * Casts a ray from camera
   * @param  { object } objects to intersect with
   * @return { void }
   */
  createAnimationCrosshairRaycaster = function (objects) {
    let camera = GEILDANKEVR.stage.getStage().camera,
      currentlyIntersecting = false,
      raycaster = new THREE.Raycaster();

    GEILDANKEVR.stage.registerAnimation('BUTTON_RAYCASTER', () => {
      let direction = {},
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
  createAnimationPointerRaycaster = function (objects) {
    let camera = GEILDANKEVR.stage.getStage().camera,
      currentlyIntersecting = false,
      raycaster = new THREE.Raycaster();

    GEILDANKEVR.stage.registerAnimation('BUTTON_RAYCASTER', () => {
      let intersects = [];

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
  createContent = function (singles) {
    let galleryWall = {},
      minOffset = 0,
      spaceBetweenThumbs = 0.2,
      thumbWidth = 2;

    galleryWall = new THREE.Object3D();
    for (let i = 0, max = singles.length; i < max; i = i + 1) {
      let params = {},
        single = {};

      params = {
        thumbWidth,
        spaceBetweenThumbs
      };

      single = createSingleThumb(singles[ i ], i, max, params);
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
  createNavigation = function () {
    let buttonGroup = {},
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
  createSingleThumb = function (config, index, count, params) {
    let geometry = {},
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
  createTexture = function (url, fit) {
    let repeatX,
      repeatY,
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
  createWallWithWindow = function (wallWidth, windowWidth, material) {
    let glassPane,
      sideWidth = (wallWidth - windowWidth) / 2,
      transparentMaterial = new THREE.MeshBasicMaterial({
        color: 0x9dcbc7,
        transparent: true,
        opacity: 0.3
      }),
      wall = new THREE.Object3D(),
      wallLeft,
      wallRight;

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
  createRoom = function (objectGroup, material) {
    let floor,
      wall1,
      wall2,
      wall3;

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
  createWorld = function () {
    let lights = [],
      objectGroup = {},
      sky,
      wallGeometry = new THREE.BoxGeometry(12, 4, 1),
      wallMaterial,
      wallMesh;

    objectGroup = new THREE.Object3D();

    wallMaterial = new THREE.MeshPhongMaterial({
      shininess: 2
    });

    wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.set(0, 2, -3);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;

    sky = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100),
      new THREE.MeshBasicMaterial({color: 0xabdcfb, side: THREE.BackSide, fog: false}));

    lights[ 0 ] = new THREE.PointLight(0xffffff, 0.75);
    lights[ 0 ].position.set(0, 3, 0);
    lights[ 0 ].castShadow = true;

    lights[ 1 ] = new THREE.AmbientLight(0x444444);
    lights[ 1 ].position.set(0, 0, 0);

    createRoom(objectGroup, wallMaterial);
    createTerrain();

    objectGroup.add(wallMesh);
    objectGroup.add(lights[ 0 ], lights[ 1 ], sky);

    return objectGroup;
  };


  /**
   * Stops scrolling animation for thumbnails, removes it from animation loop
   * @param  { object } config various parameters for scrolling animation
   * @return { void }
   */
  endThumbAnimation = function (config) {
    config.object.setMode('idle');

    GEILDANKEVR.stage.deregisterAnimation('THUMBS_SCROLLING');
  };


  /**
   * Starts scrolling animation for thumbnails
   * @param  { object } config various parameters for scrolling animation
   * @return { void }
   */
  startThumbAnimation = function (config) {
    let speed = -0.015 * config.sign;

    GEILDANKEVR.stage.registerAnimation('THUMBS_SCROLLING', () => {
      let offset = thumbsContainer.scrollOffset,
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
    let isValid = false,
      scene = {},
      singles = [],
      ui = {},
      world = {};

    isValid = typeof config.container === 'object' &&
      typeof stage.scene === 'object' &&
      typeof config.singles === 'object';

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
}());
