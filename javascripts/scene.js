(function(){
  // this also appears to set the ammojs relative path:
  Physijs.scripts.worker = 'javascripts/lib/physijs_worker.js';

  window.scene = new Physijs.Scene();
  scene.setGravity({x: 0, y: -100, z: 0});
  scene.addEventListener(
    'update',
    function() {
      scene.simulate( undefined, 2 );
    }
  );
  window.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.BasicShadowMap;

  renderer.setClearColor(0x111111, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.context.getProgramInfoLog = function () { return '' }; // fixed in three.js master, not in v66 yet

  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = 0;
  renderer.domElement.style.left = 0;
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style['z-index'] = 0;
  document.body.appendChild(renderer.domElement);
//
//  scene.add(new THREE.AmbientLight(0x888888));
//
//  pointLight = new THREE.PointLight(0xcccccc);
//  pointLight.position = new THREE.Vector3(-20, 10, 0);
//  pointLight.lookAt(new THREE.Vector3(0, 0, 0));
//  scene.add(pointLight);


  window.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
  camera.defaultPosition = [0, 26, 60];
  camera.position.fromArray(camera.defaultPosition);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var videoInput = document.getElementById('inputVideo');
  var canvasInput = document.getElementById('inputCanvas');
  if (/head/.test(window.location.href)) {
    headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 1, [0, 80, 120], new THREE.Vector3(0, 0, 0));
    // Face detection setup
    var htracker = new headtrackr.Tracker({cameraOffset : 0});
    htracker.init(videoInput, canvasInput);
    htracker.start();
  }


  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
    renderer.render(scene, camera);
  }, false);

  scene.add(camera);

  controls = new THREE.TrackballControls( camera );

  scene.table = new Physijs.BoxMesh(
    new THREE.CubeGeometry(50, 1.8, 73),
    Physijs.createMaterial(new THREE.MeshPhongMaterial({
      color: 0x003000
    }), 1, 0.9),
    0
  );
  scene.table.receiveShadow = true;
  scene.table.castShadow = true;
  var middleStripe = new THREE.Mesh( new THREE.CubeGeometry(0.3, 1.8, scene.table.geometry.depth), new THREE.MeshPhongMaterial({ color: 0xffffff }));
  middleStripe.position.set(0,0.01,0);
  scene.table.add(middleStripe);

  var leftStripe = new THREE.Mesh( new THREE.CubeGeometry(0.3, 1.8, scene.table.geometry.depth), new THREE.MeshPhongMaterial({ color: 0xffffff }));
  leftStripe.position.set(scene.table.geometry.width/2,0.01,0);
  scene.table.add(leftStripe);

  var rightStripe = new THREE.Mesh( new THREE.CubeGeometry(0.3, 1.8, scene.table.geometry.depth), new THREE.MeshPhongMaterial({ color: 0xffffff }));
  rightStripe.position.set(-scene.table.geometry.width/2,0.01,0);
  scene.table.add(rightStripe);

  var frontStripe = new THREE.Mesh( new THREE.CubeGeometry(scene.table.geometry.width, 1.8, 0.3), new THREE.MeshPhongMaterial({ color: 0xffffff }));
  frontStripe.position.set(0,0.01,scene.table.geometry.depth/2);
  scene.table.add(frontStripe);

  var backStripe = new THREE.Mesh( new THREE.CubeGeometry(scene.table.geometry.width, 1.8, 0.3), new THREE.MeshPhongMaterial({ color: 0xffffff }));
  backStripe.position.set(0,0.01,-scene.table.geometry.depth/2);
  scene.table.add(backStripe);

  [-1,1].forEach(function(fac) {
      var leg = new Physijs.BoxMesh(
              new THREE.CubeGeometry(scene.table.geometry.width, 1, 1),
              Physijs.createMaterial(new THREE.MeshPhongMaterial({ color: 0xffffff }), 1, 0), 0);
      leg.position.set(0,-1,fac * scene.table.geometry.depth/4);
      leg.visible = false;
      scene.add(leg);
  });

  scene.add(scene.table);

  new CupFormation({ side: 'near' });
  new CupFormation({ side: 'far' });

  directionalLight = new THREE.SpotLight(0xffffff, 0.7);
  //directionalLight.shadowCameraVisible = true;
  directionalLight.castShadow = true;
  directionalLight.shadowMapWidth = 6048;
  directionalLight.shadowMapHeight = 6048;
  directionalLight.position.set( 0, 800, 1 );
  directionalLight.shadowCameraLeft = -300;
  directionalLight.shadowCameraRight = 300;
  directionalLight.shadowCameraTop = 300;
  directionalLight.shadowCameraBottom = 300;
  directionalLight.shadowCameraFar = 800;
  directionalLight.shadowDarkness = 0.5;
  scene.add(directionalLight);
  // todo: play with shadows
  // ( color, intensity, distance )
  scene.rightLight = new THREE.PointLight(0xffffff, 1, 100);
  scene.rightLight.position.set(50,10,0);
  scene.add(scene.rightLight);

  scene.leftLight = new THREE.PointLight(0xffffff, 1, 100);
  scene.leftLight.position.set(-50,10,0);
  scene.add(scene.leftLight);

  scene.frontLight = new THREE.PointLight(0xffffff, 1, 100);
  scene.frontLight.position.set(0,10,scene.table.geometry.depth/2+4);
  scene.add(scene.frontLight);

  // ( color, intensity, distance )
  scene.ambientLight = new THREE.AmbientLight(0x202010);
  scene.add(scene.ambientLight );




  window.addEventListener( 'resize', function onWindowResize() {
      windowHalfX = window.innerWidth / 2,
      windowHalfY = window.innerHeight / 2,

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();


      renderer.setSize( window.innerWidth, window.innerHeight );
  }, false );

  // todo: update hud method
  var frameTrafficHud = document.getElementById('frameTraffic');
  var ballPositionHud = document.getElementById('ballPosition');

  window.render = function() {
    controls.update();
    scene.simulate();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  window.render();

}).call(this);