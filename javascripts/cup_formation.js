(function () {
  "use strict";

  var cupRadius = 3;
  var cupPlacementDistance = cupRadius * 2;
  var cupGeometry = new THREE.CylinderGeometry(cupRadius, 0.8 * cupRadius, cupRadius * 2, 32, true);
  var cupBottomGeometry = new THREE.CylinderGeometry(cupRadius * 0.8, cupRadius * 0.8, cupRadius * 0.4, 32, true);
  var cupTopGeometry = new THREE.TorusGeometry(cupRadius, cupRadius*0.07, 32, 32, Math.PI*2);
  var cupBeerGeometry = new THREE.CircleGeometry(cupRadius, 32);
  var cupMaterial = Physijs.createMaterial(new THREE.MeshPhongMaterial({color: 0xff0000}), 1, 0.9);
  var whiteMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
  var beerMaterial = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('beer.jpg')});

  window.CupFormation = function (options) {
    this.options = options;
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
        scene.table.position.y + scene.table.geometry.parameters.height / 2 + cupGeometry.parameters.height / 2,
        scene.table.geometry.depth/2 - 20
    ).multiply(this.rotation);
    this.cups = [];
    this.resetCups();
  }

  // adds a threejs object
  CupFormation.prototype.addCup = function () {
    var player = this;
    var cylinder = new Physijs.CylinderMesh(cupGeometry, cupMaterial, 1);
    var bottom = new THREE.Mesh(cupBottomGeometry, cupMaterial);
    var cupTop = new THREE.Mesh(cupTopGeometry, whiteMaterial);
    var cupBeer = new THREE.Mesh(cupBeerGeometry, beerMaterial);
    cupTop.quaternion.setFromEuler(new THREE.Euler(Math.PI/2, 0, 0, 'XYZ')); 
    cupBeer.quaternion.setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0, 'XYZ')); 
    cupTop.position.set(0,cupRadius + 0.2,0);
    cupBeer.position.set(0,cupRadius + 0.1,0)
    bottom.position.set(0,-cupRadius,0);
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

    if (offset) {
      cup.position.add(offset);
    }
    cup.__dirtyPosition = true;
    return cup;
  }


  CupFormation.prototype.rightwardCupOffset = function () {
    return new THREE.Vector3(cupPlacementDistance, 0, 0).multiply(this.rotation);
  }

  CupFormation.prototype.downwardCupOffset = function () {
    return new THREE.Vector3(0, 0, cupPlacementDistance).multiply(this.rotation);
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