(function () {
  "use strict";

  window.CupFormation = function (options) {
    this.options = options;
    this.index = options.index;
    this.side = options.side;
    this.handOffset = options.handOffset;

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

  window.CupFormation.prototype.placementNoise = function () {
    return 0;
  }

  // adds a threejs object
  CupFormation.prototype.addCup = function () {
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

  CupFormation.prototype.addCupOffsetBy = function (offset) {
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

  CupFormation.prototype.rightwardCupOffset = function () {
    return new THREE.Vector3(Game.cupPlacementDistance, 0, 0).multiply(this.rotation);
  }

  CupFormation.prototype.downwardCupOffset = function () {
    return new THREE.Vector3(0, 0, Game.cupPlacementDistance).multiply(this.rotation);
  }

  CupFormation.prototype.lastCup = function () {
    return this.cups[this.cups.length - 1]
  }

  CupFormation.prototype.sixCupFormation = function () {
    this.addCupOffsetBy(); // top
    this.addCupOffsetBy(this.rightwardCupOffset().add(this.downwardCupOffset()));
    this.addCupOffsetBy(this.rightwardCupOffset().multiplyScalar(-1).add(this.downwardCupOffset()));
    this.addCupOffsetBy(this.downwardCupOffset().multiplyScalar(2));

    this.addCupOffsetBy(this.rightwardCupOffset().multiplyScalar(2).add(this.downwardCupOffset().multiplyScalar(2)));
    this.addCupOffsetBy(this.rightwardCupOffset().multiplyScalar(-2).add(this.downwardCupOffset().multiplyScalar(2)));
  }

  CupFormation.prototype.tenCupFormation = function () {
    this.sixCupFormation();
    this.addCupOffsetBy(this.downwardCupOffset().multiplyScalar(3).add(this.rightwardCupOffset().multiplyScalar(-3)));
    this.addCupOffsetBy(this.downwardCupOffset().multiplyScalar(3).add(this.rightwardCupOffset().multiplyScalar(-1)));
    this.addCupOffsetBy(this.downwardCupOffset().multiplyScalar(3).add(this.rightwardCupOffset().multiplyScalar(1)));
    this.addCupOffsetBy(this.downwardCupOffset().multiplyScalar(3).add(this.rightwardCupOffset().multiplyScalar(3)));
  }

  // todo: this would need to work with existing cups..
  CupFormation.prototype.ibeamFormation = function () {
    this.addCupOffsetBy();
    this.addCupOffsetBy(this.downwardCupOffset());
    this.addCupOffsetBy(this.downwardCupOffset());
  }

  CupFormation.prototype.resetCups = function () {
    this.cups.forEach(function(e) {
      scene.remove(e);
    });
    this.cups = [];
    this.sixCupFormation();
  }


}).call(this);