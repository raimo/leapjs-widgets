/**
 * Work in progress; trying to create a mapping between links and physics objects.
 */
$(function() {
  Physijs.scripts.worker = 'http://local.leapmotion:8000/javascripts/lib/physijs_worker.js';
  window.scene = new Physijs.Scene();
  window.scene.addEventListener('update', function() {
    scene.simulate( undefined, 2 );
  });
  window.scene.setGravity({x:0,y:0,z:0});
  window.renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  window.renderer.shadowMapEnabled = true;
  window.renderer.shadowMapType = THREE.BasicShadowMap;


  window.renderer.setClearColor(0x000000, 0);
  window.renderer.setSize(window.innerWidth, window.innerHeight);

  window.renderer.domElement.style.position = 'fixed';
  window.renderer.domElement.style.top = 0;
  window.renderer.domElement.style.left = 0;
  window.renderer.domElement.style.width = '100%';
  window.renderer.domElement.style.height = '100%';

  document.body.appendChild(window.renderer.domElement);

  window.widgets = new LeapWidgets(window.scene);

  window.wall = widgets.createWall(new THREE.Vector3(0, 0, -200), new THREE.Vector3(window.innerWidth, window.innerHeight, 100));
  widgets.initLeapHand({scale: 2, translateY: -wall.geometry.parameters.height*0.9});

  $('a[href]').map(function(){
      var $link = $(this);
      var button = widgets.createButton($link.html(), new THREE.Vector3((this.getBoundingClientRect().left+this.getBoundingClientRect().right)/2-wall.geometry.parameters.width/2+this.offsetWidth/2, (this.getBoundingClientRect().top+this.getBoundingClientRect().bottom)/2+wall.geometry.parameters.height/2-this.offsetHeight/2, -110), new THREE.Vector3(this.offsetWidth*0.3, this.offsetHeight*0.3, 30));

      button.addEventListener('press', function(evt) {
        window.location = $link.attr('href');
      });
      console.log(this.href + ' of size ' + this.offsetWidth + 'x' + this.offsetHeight + ' at (' + (this.getBoundingClientRect().left+this.getBoundingClientRect().right)/2 + ',' + (this.getBoundingClientRect().top/this.getBoundingClientRect().bottom)/2 + ') showing ' + $(this).find('img').attr('src'));
  });

  var spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.shadowCameraVisible = true;
  spotLight.castShadow = true;
  spotLight.shadowMapWidth = 6048;
  spotLight.shadowMapHeight = 6048;
  spotLight.shadowCameraFar = 1000;
  spotLight.shadowDarkness = 0.5;
  spotLight.position.fromArray([wall.position.x, wall.position.y, wall.position.z + 2000]);
  spotLight.target.position.copy(wall.position);
  scene.add(spotLight);

  window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  window.camera.position.fromArray([0, 0, 1350]);
  window.camera.lookAt(new THREE.Vector3(0, wall.position.y, wall.position.z));

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }, false);

  scene.add(camera);
});
