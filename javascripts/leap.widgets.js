(function() {
  var BUTTON_COLOR = 0x0088ce;
  var BUTTON_COLOR_PRESSED = 0x81d41d;

  var KNOB_COLOR = 0xff2222;
  var KNOB_COLOR_ACTIVE = 0x81d41d;

  var BACKGROUND_COLOR = 0x000000;

  window.LeapWidgets = function (scene) {
    this.scene = scene;
    this.buttons = [];
    this.switches = [];
    this.sliders = [];
  }

  LeapWidgets.prototype.createWall = function(position, dimensions) {
    var wall = new Physijs.BoxMesh(
      new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z),
      Physijs.createMaterial(new THREE.MeshPhongMaterial({
        color: BACKGROUND_COLOR
      }), 1, 0.9),
      0
    );
    wall.position.copy(position);
    wall.receiveShadow = true;
    this.scene.add(wall);

    return wall;
  };
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

    button.sliderConstraint = new Physijs.SliderConstraint(
      button,
      null,
      new THREE.Vector3(0, 0, -200),
      new THREE.Vector3(0, Math.sqrt(2), Math.sqrt(2))
    );
    this.scene.addConstraint(button.sliderConstraint);
    button.sliderConstraint.setLimits(-150, 0, 0, 0);
  //      button.sliderConstraint.setRestitution(0, 0);
    this.buttons.push(button);
    return button;
  };

  LeapWidgets.prototype.createSlider = function(text, position, dimensions) {
    var slider = new Physijs.BoxMesh(
      new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z),
      Physijs.createMaterial(new THREE.MeshPhongMaterial({
        color: BUTTON_COLOR
      }), 100, 0.9),
      100
    );
    slider.originalposition = position;
    slider.position.copy(slider.originalposition);
    slider.receiveShadow = true;
    slider.castShadow = true;
    this.scene.add(slider);

//    this.createLabel(text, new THREE.Vector3(0, 0, dimensions.z/2+1), 14, 0xffffff, slider);

    slider.sliderConstraint = new Physijs.SliderConstraint(
      slider,
      null,
      new THREE.Vector3().copy(slider.originalposition),
      new THREE.Vector3(-Math.sqrt(2), 0, -Math.sqrt(2))
    );
    this.scene.addConstraint(slider.sliderConstraint);
    slider.sliderConstraint.setLimits(0, 0, 0, 0);
    slider.sliderConstraint.setRestitution(0, 0);
    this.sliders.push(slider);
    return slider;
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
//    stick.rotation.x = Math.PI*0.5;
//    stick.__dirtyRotation = true;
//    stick.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, height/2, 0));
//    stick.quaternion.multiply((new THREE.Quaternion).setFromEuler(new THREE.Euler(Math.PI/2, 0, 0)));
    stick.receiveShadow = true;
    stick.castShadow = true;
    this.createLabel(text, new THREE.Vector3(stick.originalposition.x, stick.originalposition.y - height/2 - 14, stick.originalposition.z + radius), 14, 0xffffff);

    stick.knob = new Physijs.SphereMesh(
        new THREE.SphereGeometry(32, 32, 16),
        Physijs.createMaterial(new THREE.MeshPhongMaterial({color: 0xcc1122}), 0, 0),
        100
    );
    stick.knob.position.y = height/2;
    stick.knob.castShadow = true;
    stick.knob.receiveShadow = true;
    stick.add(stick.knob);

    this.scene.add(stick);

    var point = new Physijs.PointConstraint(
      stick,
      null,
      new THREE.Vector3(stick.position.x, stick.position.y - height/2, stick.position.z)
    );
    this.scene.addConstraint(point);
  //  point.setLimits(-150, -150, 0, 0);
  //  point.setRestitution(0, 0);
    this.switches.push(stick);
    return stick;
  };

  LeapWidgets.prototype.createLabel = function(text, position, size, color, addTo) {
    var hexpadding = "#000000";
    var canvas = document.createElement("canvas");
    var widgets = this;
    var currentLabelMesh = null;
    var currentText = null;

    var label = {
        getText: function() {
            return currentText;
        },
        setText: function(text) {
            if (currentLabelMesh) {
                (addTo || widgets.scene).remove(currentLabelMesh);
            }
            currentText = text;
            var context = canvas.getContext("2d");
            context.font = size + "pt Helvetica";

            canvas.width = context.measureText(text).width;
            canvas.height = size + 8;
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

            (addTo || widgets.scene).add(mesh);
            currentLabelMesh = mesh;
        }
    };
    label.setText(text);
    return label;
  }



  LeapWidgets.prototype.update = function() {
    this.buttons.forEach(function(button) {
      button.setLinearVelocity(new THREE.Vector3().copy(button.originalposition).sub(button.position).multiplyScalar(16));
      var pressed = button.position.z+5 < button.originalposition.z;
      button.material.color.setHex(pressed ? BUTTON_COLOR_PRESSED : BUTTON_COLOR);
      if (!button.lastPressed && pressed) {
          button.dispatchEvent('press', {target: button});
      }
      if (button.lastPressed && !pressed) {
          button.dispatchEvent('pressed', {target: button});
      }
      button.lastPressed = pressed;
    });
    this.switches.forEach(function(stick) {
      stick.setLinearVelocity(new THREE.Vector3(0,1000,0));
      stick.setAngularVelocity(new THREE.Vector3(0,0,0));
      var impact = Math.pow(stick.position.z-stick.originalposition.z, 2) + Math.pow(stick.position.x-stick.originalposition.x, 2);
      var impactThreshold = 2;
      stick.knob.material.color.setHex(impact ? KNOB_COLOR_ACTIVE : KNOB_COLOR);
      if (impact > impactThreshold) {
          var angle = Math.atan2(stick.position.z, stick.position.x) + Math.PI/2;
          if (angle > Math.PI) {
              angle -= Math.PI * 2;
          }
          stick.dispatchEvent('control', {target: stick, angle: angle, impact: impact});
      }
      if (impact <= impactThreshold && stick.lastImpact > impactThreshold) {
          stick.dispatchEvent('reset', {target: stick});
      }
      stick.lastImpact = impact;
    });
  };
})();
