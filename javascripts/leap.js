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

  LeapHandler.trackThrow = function(leapHand, handMesh){
    var finger1 = leapHand.indexFinger.tipPosition;
    var finger2 = leapHand.thumb.tipPosition;
    // may need to use constraints for this

    var clonepos = pongBall.position.clone();
    handMesh.scenePosition([finger1[0], finger1[1], finger1[2]], clonepos);
    pongBall.setLinearVelocity(clonepos.sub(pongBall.position).multiplyScalar(15));
  }

}).call(this);