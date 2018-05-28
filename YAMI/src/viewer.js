/* globals Stats, dat, AMI*/

// Viewer config file
const config = require('./viewer.config');
// Managment of JSON request, and parsing
const requestManager = require('./requestManager');
// FPS managment
const animationManager = require('./animator');
// GUI managment
const guiManager = require('./guiManager');
// Controls
const CustomControls = require('./customControls');
// Scene Managment
const SceneManager = require('./sceneManager');

// standard global variables
let renderer; // @type {THREE.WebGLRenderer}
let canvas; // HTML container
let stats; // @type {Stats}

let sceneManager; // @type {sceneManager}

let changePtr = {
  hasChanged: true
};

let stackHelper; // @type {AMI.StackHelper}
let camera; // @type {THREE.OrthographicCamera}
let controls; // @type {AMI.TrackballOrthoControl}e;

let luitLayer0;

function init() {
  // renderer
  canvas = document.getElementById('r3d');
  renderer = new THREE.WebGLRenderer({
    antialias: (config.interpolation == 1),
  });

  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setClearColor(config.bgColor, 1);
  renderer.setPixelRatio(window.devicePixelRatio);
  canvas.appendChild(renderer.domElement);

  // stats
  stats = new Stats();
  canvas.appendChild(stats.domElement);

  // scene

  sceneManager = new SceneManager.default(canvas);

  // camera
  camera = new AMI.OrthographicCamera(
    canvas.clientWidth / -2, canvas.clientWidth / 2,
    canvas.clientHeight / 2, canvas.clientHeight / -2,
    0.1, 10000);
}

window.onload = function() {
  // init threeJS...
  init();

  // instantiate the loader
  // it loads and parses the dicom image
  let loader = new AMI.VolumeLoader(canvas);

  requestManager.readMultipleFiles(loader, handleSeries);

  /**
   * Visualize incoming data
   */
  function handleSeries(seriesContainer) {
    // cleanup the loader and its progress bar
    loader.free();
    loader = null;
    // prepare for slice visualization
    // first stack of first series
    let stack = seriesContainer["image"][0].mergeSeries(seriesContainer["image"])[0].stack[0];
    let stack1 = seriesContainer["fusion"][0].mergeSeries(seriesContainer["fusion"])[0].stack[0];

    stackHelper = new AMI.StackHelper(stack);
    stackHelper.bbox.visible = false;
    stackHelper.border.visible = false;

    let stacks = [stackHelper, stack1];


    sceneManager.setMainStackHelper(stackHelper);
    sceneManager.addLayer(stack1, stackHelper);

    controls = new CustomControls.default(camera, stacks, canvas, changePtr);
    camera.controls = controls;

    // set camera
    let worldbb = stack.worldBoundingBox();
    let lpsDims = new THREE.Vector3(
      (worldbb[1] - worldbb[0]) / 2,
      (worldbb[3] - worldbb[2]) / 2,
      (worldbb[5] - worldbb[4]) / 2
    );

    // box: {halfDimensions, center}
    let box = {
      center: stack.worldCenter().clone(),
      halfDimensions: new THREE.Vector3(lpsDims.x + 10, lpsDims.y + 10, lpsDims.z + 10),
    };

    // init and zoom
    let canvasConfig = {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    };

    camera.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
    camera.box = box;
    camera.canvas = canvasConfig;
    camera.update();
    camera.fitBox(2); // here 2 means 'best of width & height' (0 'width', 1 'height')

    //guiManager.updateLabels(camera.directionsLabel, stack.modality);
    //guiManager.buildGUI(stackHelper, camera);
    hookCallbacks();
  }
  /*
   * Connect all callback event observesrs
   */
  function hookCallbacks() {
    // Animation
    animationManager.startAnimating(config.fps,
      function() {
        controls.update();
        if (changePtr.hasChanged) {
          sceneManager.render(renderer, camera);
          changePtr.hasChanged = false;
        }
        stats.update();
      });

    /**
     * Handle window resize
     */
    function onWindowResize() {
      camera.canvas = {
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
      };
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      sceneManager.resize();
    }
    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();
  }
};
