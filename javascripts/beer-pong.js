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
  .use('accumulate')
  .connect()
  .on('frame', function(frame){

    var leapHand, handMesh;

    if (!frame.hands[0]) return;

    leapHand = frame.hands[0];
    handMesh = leapHand.data('riggedHand.mesh');


    leapHand.velocity = leapHand.accumulate('palmVelocity', 10, function (historyTotal) {
      var current = [0,0,0];
      historyTotal.push(leapHand.palmVelocity);
      for (var i = 0; i<historyTotal.length; i++) {
        current[0] += historyTotal[i][0] * 0.02;
        current[1] += historyTotal[i][1] * 0.02;
        current[2] += historyTotal[i][2] * 0.02;
      }
      return current;
    });

      LeapHandler.trackThrow(leapHand, handMesh);
  });

Game.begin();
