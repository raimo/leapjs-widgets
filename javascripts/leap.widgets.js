(function() {
  var BUTTON_COLOR = 0x0088ce;
  var BUTTON_COLOR_ACTIVE = 0x81d41d;

  window.LeapWidgets = function (scene) {
    this.scene = scene;
    this.buttons = [];
    this.switches = [];
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
    this.scene.add(button);

    this.createLabel(text, new THREE.Vector3(0, 0, dimensions.z/2+1), 14, 0xffffff, button);

    button.slider = new Physijs.SliderConstraint(
      button,
      null,
      new THREE.Vector3(0, 0, -200),
      new THREE.Vector3(0, Math.sqrt(2), Math.sqrt(2))
    );
    this.scene.addConstraint(button.slider);
    button.slider.setLimits(-150, 0, 0, 0);
  //      button.slider.setRestitution(0, 0);
    this.buttons.push(button);
    return button;
  };

  LeapWidgets.prototype.createSwitch = function(text, position, radius, height) {
    var stick = new Physijs.BoxMesh(
      new THREE.CylinderGeometry(radius, radius, height),
      Physijs.createMaterial(new THREE.MeshPhongMaterial({
        color: BUTTON_COLOR
      }), 1, 0.9),
      1
    );
    stick.originalposition = position;
    stick.position.copy(stick.originalposition);
    stick.receiveShadow = true;
    stick.castShadow = true;
    this.scene.add(stick);

    this.createLabel(text, new THREE.Vector3(0, 0, radius), 14, 0xffffff);

    var knob = new Physijs.SphereMesh(
        new THREE.SphereGeometry(32, 27),
        Physijs.createMaterial(new THREE.MeshPhongMaterial({color: 0xcc1122}), 0, 0),
        100
    );
    knob.position.y = height/2;
    knob.castShadow = true;
    stick.add(knob);


    var point = new Physijs.PointConstraint(
      stick,
      null,
      new THREE.Vector3(stick.position.x, stick.position.y - height/2, stick.position.z)
    );
    this.scene.addConstraint(point);
  //  stick.slider.setLimits(-150, -150, 0, 0);
  //  stick.slider.setRestitution(0, 0);
    this.switches.push(stick);
    return stick;
  };

  LeapWidgets.prototype.createLabel = function(text, position, size, color, addTo) {
    var hexpadding = "#000000";
    var canvas = document.createElement("canvas");

    var context = canvas.getContext("2d");
    context.font = size + "pt Helvetica";

    var textWidth = context.measureText(text).width;

    canvas.width = textWidth;
    canvas.height = size + 2;
    context = canvas.getContext("2d");
    context.font = size + "pt Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = hexpadding.substring(0, hexpadding.length - color.toString(16).length) + color.toString(16);
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial({
      map : texture,
      transparent: true
    });

    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
    mesh.doubleSided = true;
    mesh.position.copy(position);

    (addTo || this.scene).add(mesh);
    return mesh;
  }



  LeapWidgets.prototype.update = function() {
    this.buttons.forEach(function(button) {
      button.setLinearVelocity(new THREE.Vector3().copy(button.originalposition).sub(button.position).multiplyScalar(16));
      button.material.color.setHex(button.position.z+2 < button.originalposition.z ? BUTTON_COLOR_ACTIVE : BUTTON_COLOR);
    });
    this.switches.forEach(function(stick) {
      stick.setLinearVelocity(new THREE.Vector3(0,1000,0));
      stick.setAngularVelocity(new THREE.Vector3(0,0,0));
    });
  };
})();
