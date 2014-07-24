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
  LeapWidgets.prototype.initLeapHand = function(opts) {
    opts = opts || {};
    var sampleRecording = opts['sampleRecording'];
    var scale = opts['scale'] || 1;
    var baseBoneRotation = (new THREE.Quaternion).setFromEuler(
        new THREE.Euler(Math.PI / 2, 0, 0)
    );
    var boneWidthDefault = 10; // TODO not returned by recorder yet.
    Leap.loop({
      frame: function() {
        widgets.update();
        scene.simulate();
        renderer.render(scene, camera);
      },
      hand: function (hand) {

        hand.fingers.forEach(function (finger) {

          finger.data('boneMeshes').forEach(function(mesh, i){
            var bone = finger.bones[i];
            var bonePosition = new THREE.Vector3().fromArray(bone.center()).multiplyScalar(scale);
            bonePosition.y -= (opts['translateY'] || 130) * scale;
            bonePosition.x += (opts['translateX'] || 0) * scale;
            bonePosition.z += (opts['translateZ'] || 80) * scale;
            mesh.setLinearVelocity(bonePosition.sub(mesh.position).multiplyScalar(16));
            mesh.setRotationFromMatrix(new THREE.Matrix4().fromArray(bone.matrix()));
            mesh.quaternion.multiply(baseBoneRotation);
            mesh.__dirtyRotation = true;
          });

          finger.data('jointMeshes').forEach(function(mesh, i){
            var bone = finger.bones[i];
            var jointPosition = new THREE.Vector3().fromArray(bone ? bone.prevJoint : finger.bones[i-1].nextJoint).multiplyScalar(scale);
            jointPosition.y -= 130 * scale;
            jointPosition.z += 80 * scale;
            mesh.setLinearVelocity(jointPosition.sub(mesh.position).multiplyScalar(20));
            mesh.setAngularVelocity(new THREE.Vector3());
          });

        });
      }
    })
      // these two LeapJS plugins, handHold and handEntry are available from leapjs-plugins, included above.
      // handHold provides hand.data
      // handEntry provides handFound/handLost events.
    .use('handHold')
    .use('handEntry')
    .on('handFound', function(hand){
      hand.fingers.forEach(function (finger, fingerIndex) {

        var boneMeshes = [];
        var jointMeshes = [];

        finger.bones.forEach(function(bone, boneIndex) {
          var boneWidth = bone.width || boneWidthDefault;
          var boneMesh = new Physijs.CylinderMesh(
              new THREE.CylinderGeometry(boneWidth/2 * scale, boneWidth/2 * scale, (bone.length - boneWidth) * scale),
              Physijs.createMaterial(new THREE.MeshPhongMaterial(), 0, 0),
              100
          );
          // TODO: why does the thumb have this extra bone? Removing it
          if (boneIndex === 0 && fingerIndex === 0) {
            boneMesh.visible = false;
            boneMesh.mass = 0;
          }
          boneMesh.castShadow = true;
          boneMesh.position.fromArray([0,100,0]);
          scene.add(boneMesh);
          boneMeshes.push(boneMesh);
        });

        for (var i = 0; i < finger.bones.length + 1; i++) {
          var jointMesh = new Physijs.SphereMesh(
              new THREE.SphereGeometry(((finger.bones[i] || finger.bones[i-1]).width || boneWidthDefault)/2 * scale, 16),
              Physijs.createMaterial(new THREE.MeshPhongMaterial(), 0, 0),
              100
          );
        //  jointMesh.sticky = (finger.bones.length == i);
          jointMesh.castShadow = true;
          jointMesh.position.fromArray([0,100,0]);
          if (i === 0 && fingerIndex === 0) {
            jointMesh.visible = false;
            jointMesh.mass = 0;
          }

          jointMesh.material.color.setHex(0x0088ce);
          scene.add(jointMesh);
          jointMeshes.push(jointMesh);
        }


        finger.data('boneMeshes', boneMeshes);
        finger.data('jointMeshes', jointMeshes);

      });

    })
    .on('handLost', function(hand){

      hand.fingers.forEach(function (finger) {

        var boneMeshes = finger.data('boneMeshes');
        var jointMeshes = finger.data('jointMeshes');

        boneMeshes.forEach(function(mesh){
          scene.remove(mesh);
        });

        jointMeshes.forEach(function(mesh){
          scene.remove(mesh);
        });

        finger.data({
          boneMeshes: null,
          boneMeshes: null
        });

      });
    })
    .use('playback', {
      // This is a compressed JSON file of preprecorded frame data
      recording: sampleRecording,
      // How long, in ms, between repeating the recording.
      timeBetweenLoops: 2000,
      pauseOnHand: true
    })
    .connect();


  };

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

  LeapWidgets.prototype.createSlider = function(text, initial, position, dimensions) {
    var slider = new Physijs.BoxMesh(
      new THREE.BoxGeometry(50, dimensions.y, dimensions.z),
      Physijs.createMaterial(new THREE.MeshPhongMaterial({
        color: BUTTON_COLOR
      }), 1, 0),
      350
    );
    slider.originalposition = new THREE.Vector3(position.x, position.y, position.z);
    slider.minposition = position.x - dimensions.x + slider.geometry.parameters.width*2;
    slider.maxposition = position.x + dimensions.x - slider.geometry.parameters.width*2;
    slider.position.copy(slider.originalposition);
    slider.receiveShadow = true;
    slider.castShadow = true;
    this.scene.add(slider);

//    this.createLabel(text, new THREE.Vector3(0, 0, dimensions.z/2+1), 14, 0xffffff, slider);

    slider.sliderConstraint = new Physijs.SliderConstraint(
      slider,
      null,
      new THREE.Vector3().copy(slider.originalposition),
      new THREE.Vector3(0, 1, 0)
    );
    this.scene.addConstraint(slider.sliderConstraint);
    slider.sliderConstraint.setLimits(-dimensions.x/2, dimensions.x/2, 0, 0);
    slider.position.x = slider.minposition +  (slider.maxposition - slider.minposition) * (initial/100);
    slider.__dirtyPosition = true;
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
      stick.knob.material.color.setHex(impact > impactThreshold ? KNOB_COLOR_ACTIVE : KNOB_COLOR);
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
    this.sliders.forEach(function(slider) {
      var value = Math.min(1, Math.max(0, Math.round((slider.position.x - slider.minposition) * 1000 / (slider.maxposition - slider.minposition)) / 1000));
      if (slider.lastvalue != value) {
          slider.dispatchEvent('change', {value: value});
      }
      slider.lastvalue = value;
    });
  };
})();
