(function () {

  window.Game = {};

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
  };
}).call(this);