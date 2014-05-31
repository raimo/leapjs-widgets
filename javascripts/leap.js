(function () {
  "use strict";

  window.LeapHandler = {};

  // Keys are firebase player IDs
  // Values are the most-recent frame from that player
  // This data is used by the animation loop
  LeapHandler.userFrames = {};


  // gets set after Leap controller is set up.
  this.playback = undefined;


  LeapHandler.addUserFrame = function(userId, frameData){
    this.userFrames[userId] = frameData;
  }

  LeapHandler.followPhysics = function(frame){
    if (frame.ballPosition){
      pongBall.position.fromArray(frame.ballPosition)
      pongBall.__dirtyPosition = true;
      pongBall.mass = 0;
    }
  }

  LeapHandler.trackThrow = function(leapHand, handMesh){
    if (leapHand.pinchStrength > 0.5) {
      if (!pongBall.inHand) pongBall.grab();

      var finger1 = leapHand.indexFinger.tipPosition;
      var finger2 = leapHand.thumb.tipPosition;
      // may need to use constraints for this

      handMesh.scenePosition([(finger1[0]+finger2[0])/2, (finger1[1]+finger2[1])/2, (finger1[2]+finger2[2])/2], pongBall.position);
      pongBall.__dirtyPosition = true;
      pongBall.setLinearVelocity({x: leapHand.velocity[0], y: leapHand.velocity[1], z: leapHand.velocity[2]});

    }else{
      if (pongBall.inHand) pongBall.release();
//      if (!pongBall.inFlight()){
//        console.log('ball is stationary, aborting turn');
//        Game.toggleTurn();
//      }
    }
  }

}).call(this);