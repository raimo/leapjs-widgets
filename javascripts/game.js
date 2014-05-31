(function () {

  window.Game = {};
  var cupRadius = 3;

  Game.cupPlacementDistance = cupRadius * 1.7;

  //  CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
  Game.cupGeometry = new THREE.CylinderGeometry(cupRadius, 0.8 * cupRadius, cupRadius * 2, 32, true);
  Game.cupBottomGeometry = new THREE.CylinderGeometry(cupRadius * 0.8, cupRadius * 0.8, cupRadius * 0.4, 32, true);
  Game.cupTopGeometry = new THREE.TorusGeometry(cupRadius, cupRadius*0.07, 32, 32, Math.PI*2);
  Game.cupBeerGeometry = new THREE.CircleGeometry(cupRadius, 32);
  Game.cupMaterial = Physijs.createMaterial(new THREE.MeshPhongMaterial({color: 0xff0000}), 1, 0.9);
  Game.whiteMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
  Game.beerMaterial = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('beer.jpg')});


  Game.player1 = new CupFormation({
    side: 'near',
    index: 1,
    handOffset: (new THREE.Vector3(0, 0, 200)),
    handQuaternion: new THREE.Quaternion,
    cameraPosition: (new THREE.Vector3).fromArray(camera.defaultPosition)
  });

  p2camPos = (new THREE.Vector3).fromArray(camera.defaultPosition);
  p2camPos.z = p2camPos.z * -1;

  Game.player2 = new CupFormation({
    side: 'far',
    index: 2,
    handOffset: (new THREE.Vector3(0, 0, -200)),
    handQuaternion: (new THREE.Quaternion).setFromEuler(new THREE.Euler(0, Math.PI, 0)),
    cameraPosition: p2camPos
  });

  Game.getPlayerById = function(userId){
    if (userId === this.player1.userId) return this.player1;
    if (userId === this.player2.userId) return this.player2;
  }

  Game.id = function () {
    return window.location.hash.split('#')[1];
  }

  Game.userId = 'player1';


  Game.framesSent = 0;
  Game.framesReceived = 0;
  Game.playerCount = 1;
  Game.streamFrames = false;


  Game.recentSentFrameRefs = [];

  Game.takeRole = function(roleName){
    console.log("Assigned as " + roleName);

    // allow another player to take this spot:
    this.rolesRef.child(roleName).onDisconnect().remove();

    var role = Game[roleName];
    role.setCamera();
  }

  Game.begin = function () {
    Game.reset();
    window.render();
  };


  Game.reset = function() {
    this.player1.resetCups();
    this.player2.resetCups();
    pongBall.reset();
  };


  // what does this method do?
  Game.overlay = function (text, func) {
    var $overlay = $('<div class="overlay"></div>');
    $overlay.appendTo($('body')).html(text)
      .fadeIn('fast').animate({}, {duration: 6000})
      .animate({ 'opacity': 0 }, {
        duration: 1000,
        complete: function (e) {
          $overlay.remove();
          func && func();
        }
      });
  }
}).call(this);