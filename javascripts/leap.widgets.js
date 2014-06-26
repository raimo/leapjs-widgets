(function() {
  var BUTTON_COLOR = 0x0088ce;
  var BUTTON_COLOR_ACTIVE = 0x81d41d;

  window.LeapWidgets = function (scene) {
    this.buttons = [];
  }

  LeapWidgets.prototype.createButton = function(text, position, dimensions) {
    var button = new Physijs.BoxMesh(
      new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z),
      Physijs.createMaterial(new THREE.MeshPhongMaterial({
        color: BUTTON_COLOR
      }), 1, 0.9),
      100
    );
    button.originalposition = position;
    button.position.copy(button.originalposition);
    button.receiveShadow = true;
    button.castShadow = true;
    scene.add(button);

    button.add(createLabel(text, new THREE.Vector3(0, 0, dimensions.z/2+1), 14, 0xffffff));

    button.slider = new Physijs.SliderConstraint(
      button,
      null,
      new THREE.Vector3(0, 0, -200),
      new THREE.Vector3(0, Math.sqrt(2), Math.sqrt(2))
    );
    scene.addConstraint(button.slider);
    button.slider.setLimits(-150, 0, 0, 0);
  //      button.slider.setRestitution(0, 0);
    this.buttons.push(button);
    return button;
  }


  LeapWidgets.prototype.update = function() {
    this.buttons.forEach(function(button) {
      button.setLinearVelocity(new THREE.Vector3().copy(button.originalposition).sub(button.position).multiplyScalar(16));
      button.material.color.setHex(button.position.z+2 < button.originalposition.z ? BUTTON_COLOR_ACTIVE : BUTTON_COLOR);
    });
  };
})();
