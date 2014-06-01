(window.controller = new Leap.Controller)
  .use('transform', {
    position: function(hand){
      return new THREE.Vector3(0, 0, 200);
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
