(function () {
  "use strict";

  var applaudeSound = document.getElementById('applaude');
  applaudeSound.addEventListener('ended', function() { applaudeSound.load(); });

  window.Player = function (options) {
    this.options = options;
    this.index = options.index;
    this.side = options.side; // 1 or -1
    this.handOffset = options.handOffset;
    this.handQuaternion = options.handQuaternion;

    if (this.side == 'far'){
      this.rotation = new THREE.Vector3(-1, 1, -1)
    }else{
      this.rotation = new THREE.Vector3(1, 1, 1)
    }

    this.pointPosition = new THREE.Vector3(
      0,
      // is there a better way of getting table top-surface position?
        scene.table.position.y + scene.table.geometry.height / 2 + Game.cupGeometry.height / 2,
        scene.table.geometry.depth/2 - 20
    ).multiply(this.rotation);
    this.cups = [];
  }

  window.Player.prototype.placementNoise = function () {
    return 0;
  }

  Player.prototype.setCamera = function(){
    window.camera.position = this.options.cameraPosition;
    window.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }


  // adds a threejs object
  Player.prototype.addCup = function () {
    var player = this;
    var cylinder = new Physijs.CylinderMesh(Game.cupGeometry, Game.cupMaterial, 0);
    var bottom = new THREE.Mesh(Game.cupBottomGeometry, Game.cupMaterial);
    var cupTop = new THREE.Mesh(Game.cupTopGeometry, Game.whiteMaterial);
    var cupBeer = new THREE.Mesh(Game.cupBeerGeometry, Game.beerMaterial);
    cupTop.quaternion.setFromEuler(new THREE.Euler(Math.PI/2, 0, 0, 'XYZ')); 
    cupBeer.quaternion.setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0, 'XYZ')); 
    cylinder.addEventListener('collision', function(o, velocity) {
      if (cylinder.position.y + cylinder.geometry.height/2 < o.position.y && cylinder.position.distanceTo(o.position) < 5.21) {
        var cylinderIndex = player.cups.indexOf(cylinder);
        if (cylinderIndex > -1) {
          player.cups.splice(cylinderIndex, 1);
        }

        scene.remove(cylinder);
        pongBall.setLinearVelocity({x:0,y:0,z:0});
        $('#player' + player.index + ' .cups').append('<img src="images/cup.png">');
        if (cylinder.position.z > 0) {
          boo.play();
          if (player.cups.length === 0) {
            Game.overlay('You lose', function() {
              Game.reset();
            });
          }
        } else {
          if (player.cups.length === 0) {
            Game.overlay('You win', function() {
              Game.reset();
            });
          }
          applaudeSound.play();
        }
      }
    });
    cupTop.position.set(0,3.2,0);
    cupBeer.position.set(0,3.1,0)
    bottom.position.set(0,-3,0);
//   bottom.castShadow = cylinder.castShadow = true;
   bottom.receiveShadow = cylinder.receiveShadow = true;
    cylinder.add(cupBeer);
    cylinder.add(bottom);
    cylinder.add(cupTop);
    scene.add(cylinder);
    this.cups.push(cylinder);
    return cylinder;
  };

  Player.prototype.addCupOffsetBy = function (offset) {
    var previousPosition = this.cups[this.cups.length - 1]
    var cup = this.addCup();
    cup.position.copy(this.pointPosition);
    cup.position.y = 4.5;

    if (offset) {
      cup.position.add(offset);
    }
    cup.__dirtyPosition = true;
    return cup
  }


  var cupPlacementDistance = 6;

  Player.prototype.rightwardCupOffset = function () {
    return new THREE.Vector3(Game.cupPlacementDistance, 0, 0).multiply(this.rotation);
  }

  Player.prototype.downwardCupOffset = function () {
    return new THREE.Vector3(0, 0, Game.cupPlacementDistance).multiply(this.rotation);
  }

  Player.prototype.lastCup = function () {
    return this.cups[this.cups.length - 1]
  }

  Player.prototype.sixCupFormation = function () {
    this.addCupOffsetBy(); // top
    this.addCupOffsetBy(this.rightwardCupOffset().add(this.downwardCupOffset()));
    this.addCupOffsetBy(this.rightwardCupOffset().multiplyScalar(-1).add(this.downwardCupOffset()));
    this.addCupOffsetBy(this.downwardCupOffset().multiplyScalar(2));

    this.addCupOffsetBy(this.rightwardCupOffset().multiplyScalar(2).add(this.downwardCupOffset().multiplyScalar(2)));
    this.addCupOffsetBy(this.rightwardCupOffset().multiplyScalar(-2).add(this.downwardCupOffset().multiplyScalar(2)));
  }

  Player.prototype.tenCupFormation = function () {
    this.sixCupFormation();
    this.addCupOffsetBy(this.downwardCupOffset().multiplyScalar(3).add(this.rightwardCupOffset().multiplyScalar(-3)));
    this.addCupOffsetBy(this.downwardCupOffset().multiplyScalar(3).add(this.rightwardCupOffset().multiplyScalar(-1)));
    this.addCupOffsetBy(this.downwardCupOffset().multiplyScalar(3).add(this.rightwardCupOffset().multiplyScalar(1)));
    this.addCupOffsetBy(this.downwardCupOffset().multiplyScalar(3).add(this.rightwardCupOffset().multiplyScalar(3)));
  }

  // todo: this would need to work with existing cups..
  Player.prototype.ibeamFormation = function () {
    this.addCupOffsetBy();
    this.addCupOffsetBy(this.downwardCupOffset());
    this.addCupOffsetBy(this.downwardCupOffset());
  }

  Player.prototype.resetCups = function () {
    $('#player' + this.index + ' .cups').html('');
    this.cups.forEach(function(e) {
      scene.remove(e);
    });
    this.cups = [];
    this.tenCupFormation();
  }


}).call(this);