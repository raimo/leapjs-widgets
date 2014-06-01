(window.controller = new Leap.Controller)
  .use('transform', {
    quaternion: function(hand){
      var player = Game.getPlayerById(hand.userId);
      var quaternion = (player && player.options.handQuaternion) || Game.player1.options.handQuaternion;
      return quaternion
    },
    position: function(hand){
      // these numbers are hardcoded in raw leap-space, not sure how to convert easily yet
      var player = Game.getPlayerById(hand.userId);
      return (player && player.options.handOffset)    || Game.player1.options.handOffset;
    }
  })
  .use('riggedHand', {
    parent: window.scene,
    positionScale: 2.5,
    scale: 1.5,
    boneColors: function(){
      return {
        hue: 0.1,
        saturation: 1,
        lightness: 0.88
      }
    }
  })
  .connect()
  .on('frame', function(frame){

    var leapHand, handMesh;

    if (!frame.hands[0]) return;

    leapHand = frame.hands[0];
    handMesh = leapHand.data('riggedHand.mesh');
    [leapHand.indexFinger.tipPosition, leapHand.thumb.tipPosition].forEach(function(finger, i) {
        var clonepos = pongBall.position.clone();
        handMesh.scenePosition([finger[0], finger[1], finger[2]], clonepos);
        console.log(finger, i);
        pongBall.setLinearVelocity(clonepos.sub(pongBall.position).multiplyScalar(15));
    });
  });

Game.begin();
