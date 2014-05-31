(function () {
  "use strict";

  // This class handles two things:
  // - Frame Callbacks for gameplay
  // - Frame sharing between players

  window.LeapHandler = {};

  // streaming hasn't yet made it in to 0.6.0-beta1
  LeapHandler.streamingLocalFrames = false;
  LeapHandler.frameSharingEnabled = false;

  var palmPositionHud = document.getElementById('palmPosition');
  var palmVelocityHud = document.getElementById('palmVelocity');
  var tipAvgVelHud = document.getElementById('tipAvgVel');
  var pinchStrHud = document.getElementById('pinchStr');


  // Keys are firebase player IDs
  // Values are the most-recent frame from that player
  // This data is used by the animation loop
  LeapHandler.userFrames = {};


  // gets set after Leap controller is set up.
  this.playback = undefined;


  LeapHandler.addUserFrame = function(userId, frameData){
    this.userFrames[userId] = frameData;
  }

  LeapHandler.clearUser = function(userId){
    delete this.userFrames[userId];
  }


  // This sorely needs proper LeapJS support
  LeapHandler.enableFrameSharing = function () {
    if (this.frameSharingEnabled) return;
    this.frameSharingEnabled = true;

    this.originalProtocol = window.controller.connection.protocol;
    window.controller.connection.protocol = this.shareFrameDataProtocol;

    // Copy methods/properties from the default protocol over
    for (var property in this.originalProtocol) {
      if (this.originalProtocol.hasOwnProperty(property)) {
        this.shareFrameDataProtocol[property] = this.originalProtocol[property]
      }
    }
  }

  // determines if a given set of local frame data is interesting and should be sent.
  LeapHandler.shouldSendFrame = function(localFrameData){
    if (Game.playerCount.length < 2) return false;

    // ball position synchronized with frames
    if (!pongBall.belowTable) return true;

    if (localFrameData.hands.length) return true;

    // send the fact that hands have disappeared
    if (Game.mostRecentlySentFrame && Game.mostRecentlySentFrame.hands.length) return true;

    return false;
  }

  // takes in a frame from the local machine
  LeapHandler.shareFrameDataProtocol = function(localFrameData){
    var eventOrFrame = LeapHandler.originalProtocol(localFrameData);

    if (eventOrFrame instanceof Leap.Frame) {
      this.makeIdsUniversal(localFrameData);

      if ((localFrameData.id % 2) == 0 && this.shouldSendFrame(localFrameData)){
        Game.shareFrameData(localFrameData);
      }

      // this means creating double frames every time. eh.
      eventOrFrame = this.createSplicedFrame(localFrameData);
    }

    return eventOrFrame;
  }.bind(LeapHandler);

  // converts hand and pointable integer IDs to UUIDs
  LeapHandler.makeIdsUniversal = function(frameData){
    var i, hand, pointable;

    for (i = 0; i < frameData.hands.length; i++) {
      hand = frameData.hands[i];
      hand.userId = Game.userId;
      hand.id = hand.id + Game.userId;
      console.assert(typeof hand.id === 'string', "Invalid hand id: " + hand.id);
    }

    for (i = 0; i < frameData.pointables.length; i++) {
      pointable = frameData.pointables[i];
      pointable.id = pointable.id + Game.userId;
      pointable.handId = pointable.handId + Game.userId;
    }
  }


  LeapHandler.createSplicedFrame = function(localFrameData){

    // C&P out of recordFrameHandler, but without the call to finishRecording
    LeapHandler.playback.setGraphic('wave');
    if (localFrameData.hands.length > 0){
      LeapHandler.playback.frameData.push(localFrameData);
      LeapHandler.playback.hideOverlay();
    }

    LeapHandler.spliceInSharedFrames(localFrameData);
    return this.createFrame(localFrameData);
  }

  LeapHandler.createFrame = function(frameData){
    var frame = new Leap.Frame(frameData);

    frame.ballPosition = frameData.ballPosition;
    for (var i = 0; i < frameData.hands.length; i++){
      // assuming ordering is the same :-/
      frame.hands[i].userId = frameData.hands[i].userId;
      frame.hands[i].fromFrameId = frameData.hands[i].fromFrameId;
    }
    return frame;
  }

  // takes in a raw (local frame, usually)
  // adds in any set the other user frames
  LeapHandler.spliceInSharedFrames = function(frameData){
    var i, userFrame, userId; // no pointable support for now

    for (userId in this.userFrames){
      userFrame = this.userFrames[userId];

      if (userFrame.ballPosition){
        // if ballPosition is set from master frame, use it
        frameData.ballPosition = userFrame.ballPosition;
      }

      if (userFrame.hands){ // not sure why

        for (i = 0; i < userFrame.hands.length; i++){
          frameData.hands.push(userFrame.hands[i]);
          userFrame.hands[i].fromFrameId = userFrame.id;
        }
        for (i = 0; i < userFrame.pointables.length; i++){
          frameData.pointables.push(userFrame.pointables[i]);
        }
      }
    }
  }

  // When the controller is not connected, this makes sure frame data gets used and emitted
  LeapHandler.updateSharedFramesLoop = function(){
    if (this.streamingLocalFrames) return;
    var userId, frameData, frame;

    // take the first frame as the "master" frame which others are added to
    for (userId in this.userFrames){
      break;
    }


    if (userId){
      frameData = this.userFrames[userId];
      delete this.userFrames[userId];
      this.spliceInSharedFrames(frameData);

      frame = this.createFrame(frameData);
      console.log('observer loop. hands:', frame.hands.length);

      // send a deviceFrame to the controller:
      // this frame gets picked up by the controllers own animation loop.
      // todo: might be introducing an artificial frame of lag here :-/
      window.controller.processFrame(frame);
    }


    window.requestAnimationFrame(this.updateSharedFramesLoop);
  }.bind(LeapHandler);


  LeapHandler.updateHud = function(hand, mesh){
    palmPositionHud.innerHTML = mesh.position.toArray().map(function(num){return Math.round(num)});
    palmVelocityHud.innerHTML = hand.palmVelocity.map(function(num){return Math.round(num)});
    pinchStrHud.innerHTML = hand.pinchStrength;
    tipAvgVelHud.innerHTML = hand.velocity.map(function(num){ return num.toPrecision(2) });
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