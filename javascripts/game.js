(function () {

  // http://www.explainxkcd.com/wiki/index.php/List_of_all_comics
  // $('.wikitable tr td:nth-child(2)').text().replace(/\(create\)/g, '').split("\n")[0]
  var playerNames = [" Free Speech ", " Orbital Mechanics ", " Airplane Message ", " Heartbleed Explanation ", " Heartbleed ", " Cosmologist on a Tire Swing ", " Metamaterials ", " Lorenz ", " Shouldn't Be Hard ", " Before the Internet ", " t Distribution ", " Career ", " Answers ", " Digits ", " Manuals ", " Ancient Stars ", " Types of Editors ", " Unique Date ", " When You Assume ", " Land Mammals ", " Hack ", " Transformers ", " Now ", " Second ", " First Date ", " Slippery Slope ", " Frequency ", " Kola Borehole ", " Standing ", " Update ", " Mobile Marketing ", " Sharks ", " Rejection ", " Weather ", " Protocol ", " Winter ", " Cold ", " Walmart ", " Automation ", " Actually ", " Theft ", " Inexplicable ", " Questions for God ", " Photos ", " Regex Golf ", " Haskell ", " 2014 ", " Goldbach Conjectures ", " Infinite Scrolling ", " Christmas Lights ", " Buzzfeed Christmas ", " Sigil Cycle ", " Undocumented Feature ", " Glass Trolling ", " Profile Info ", " Year in Review ", " File Extensions ", " Galilean Moons ", " I Don't Own a TV ", " Exoplanet Neighborhood ", " Oort Cloud ", " Git Commit ", " New Study ", " Telescope Names ", " Job Interview ", " Pi vs. Tau ", " Shoot for the Moon ", " Syllable Planning ", " Simple Answers ", " Substitutions ", " Puzzle ", " Encryptic ", " Third Way ", " Improved Keyboard ", " Headlines ", " Monty Hall ", " Minifigs ", " Mystery News ", " Reverse Identity Theft ", " Giraffes ", " Ayn Random ", " Angular Size ", " int(pi) ", " Open Letter ", " Tall Infographics ", " Shadowfacts ", " Highlighting ", " Functional ", " Privacy Opinions ", " Alternate Universe ", " Mess ", " Halting Problem ", " Juicer ", " Slideshow ", " Reassuring ", " Unquote ", " Shake That ", " LD50 ", " Bee Orchid ", " First ", " Monster ", " Questions ", " Columbus ", " Preferred Chat System ", " Exoplanet Names ", " Increased Risk ", " Anti-Glass ", " Old Accounts ", " Meteor Showers ", " Sphere ", " The Mother of All Suspicious Files ", " Pale Blue Dot ", " 10-Day Forecast ", " Six Words ", " Snare ", " Scary Names ", " Annoying Ringtone Champion ", " Quantum Mechanics ", " Social Media ", " Enlightenment ", " QR Code ", " Seashell ", " Settled ", " Douglas Engelbart (1925-2013) ", " Relativity ", " Realistic Criteria ", " Habitable Zone ", " Polar/Cartesian ", " Screensaver ", " Prometheus ", " The Pace of Modern Life ", " Balloon Internet ", " Ice Sheets ", " Council of 300 ", " Dwarf Fortress ", " Pastime ", " Nomenclature ", " Hipsters ", " Reports ", " Doors of Durin ", " Cells ", " Sticks and Stones ", " Insight ", " Geoguessr ", " Combination Vision Test ", " Interstellar Memes ", " Birds and Dinosaurs ", " I'm So Random ", " Encoding ", " Footnote Labyrinths ", " AirAware ", " Einstein ", " Is It Worth the Time? ", " Detail ", " Time Machines ", " Girls and Boys ", " Integration by Parts ", " Authorization ", " Silence ", " Geologist ", " All Adobe Updates ", " Subways ", " Flowchart ", " Stratigraphic Record ", " Externalities ", " Humming ", " The Past ", " Time ", " Voyager 1 ", " Bonding ", " Aspect Ratio ", " Bumblebees ", " Ineffective Sorts ", " Circumference Formula ", " Rose Petals ", " Rembrandt Photo ", " PGP ", " Virus Venn Diagram ", " ISO 8601 ", " Pickup Artists ", " Time Robot ", " Those Not Present ", " Moving Sidewalks ", " App ", " Steroids ", " Workflow ", " Perl Problems ", " Bridge ", " Expedition ", " tar ", " Star Trek into Darkness ", " Argument ", " Amazon ", " Home Alone ", " Debugger ", " Log Scale ", " Hand Sanitizer ", " Drop Those Pounds ", " Countdown ", " Rubber Sheet ", " Sick Day ", " Conditioning ", " Kolmogorov Directions ", " Resolution ", " Proof ", " Communion ", " Tests ", " Instagram ", " Broomstick ", " Nothing to Offer ", " Evolving ", " Honest ", " Sky Color ", " Tags ", " Location ", " Coverage ", " Two Years ", " Calendar of Meaningful Dates ", " Rubber and Glue ", " Heatmap ", " RTL ", " Broken Mirror ", " Arachnoneurology ", " Logic Boat ", " Up Goer Five ", " Frequentists vs. Bayesians ", " Math ", " Poll Watching ", " Cell Number ", " Fifty Shades ", " Congress ", " Epsilon and Zeta ", " Objects In Mirror ", " Law of Drama ", " The Universal Label ", " Electoral Precedent ", " Identity ", " Blurring the Line ", " Undoing ", " Microsoft ", " My Sky ", " Traffic Lights ", " Sky ", " Metallurgy ", " Killed in Action ", " Think Logically ", " Premiere ", " Click and Drag ", " Refrigerator ", " Cautionary Ghost ", " Sports Cheat Sheet ", " ADD ", " License Plate ", " Feathers ", " Nine ", " Fastest-Growing ", " Sketchiness ", " Vows ", " Tuesdays ", " Star Ratings ", " A Hypochondriac's Nightmare ", " Clinically Studied Ingredient ", " Crazy Straws ", " Interview ", " Forget ", " Michael Phelps ", " Curiosity ", " Formal Languages ", " Internal Monologue ", " Five Years ", " Cirith Ungol ", " Eyelash Wish Log ", " ContextBot ", " Server Problem ", " Writing Styles ", " Geology ", " Argument Victory ", " Visual Field ", " United Shapes ", " Knights ", " Home Organization ", " Groundhog Day ", " Warning ", " Moon Landing ", " Weekend ", " Seventies ", " Exoplanets ", " Words for Small Sets ", " Alphabet ", " Swiftkey ", " Pressures ", " Laundry ", " Shoes ", " Front Door ", " Kill Hitler ", " Budget News ", " EST ", " Crowdsourcing ", " Bel-Air ", " Old-Timers ", " Klout ", " Felidae ", " Kickstarter ", " The bacon ", " Ten Thousand ", " Every Major's Terrible ", " Visited ", " Forgot Algebra ", " Bookshelf ", " Emotion ", " Approximations ", " Skynet ", " Constraints ", " Romney Quiz ", " Ablogalypse ", " Never ", " Whites of Their Eyes ", " Lakes and Oceans ", " RuBisCO ", " Fountain ", " Umwelt ", " Reviews ", " Cadbury Eggs ", " Share Buttons ", " Formal Logic ", " Networking ", " s/keyboard/leopard/ ", " Keyed ", " Drawing Stars ", " Communication ", " Pickup Artist ", " Compare and Contrast ", " Tumblr ", " Error Code ", " Late-Night PBS ", " So It Has Come To This ", " Business Plan ", " Orion Nebula ", " First Post ", " Good Cop, Dadaist Cop ", " Backward in Time ", " Valentine Dilemma ", " Kerning ", " Car Problems ", " Wake Up Sheeple ", " Wrong Superhero ", " Baby Names ", " Etymology-Man ", " Sigh ", " Suckville ", " Sustainable ", " Sloppier Than Fiction ", " SOPA ", " Batman ", " Adam and Eve ", " Game AIs ", " AAAAAA ", ""]

  var latencyHud = document.getElementById('latencyHud');
  var incomingFPSHud = document.getElementById('incomingFPSHud');

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


  Game.player1 = new Player({
    side: 'near',
    index: 1,
    handOffset: (new THREE.Vector3(0, 0, 200)),
    handQuaternion: new THREE.Quaternion,
    cameraPosition: (new THREE.Vector3).fromArray(camera.defaultPosition)
  });

  p2camPos = (new THREE.Vector3).fromArray(camera.defaultPosition);
  p2camPos.z = p2camPos.z * -1;

  Game.player2 = new Player({
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

  Game.gamesRef = window.firebase.child('games');

  Game.recentSentFrameRefs = [];

  // firebase structure:
  // /game/<id>/players/<id>/frames
  Game.connectToLiveGame = function () {
    console.log('Connecting to server');
    console.time('firebase-connection');
    if (this.id()) {
      this.gameRef = this.gamesRef.child(this.id());

      this.gameRef.once('value', function (snapshot) {

        if (snapshot.val() == null) {
          // invalid id
          this.createLiveGame();
          return
        }

        $('#main-menu').hide();
        $('#players').show();
        console.log('Connected to game ' + this.gameRef.name() + ', created:  ' + new Date(snapshot.val().created_at))
        this.overlay('Pinch to control the ball.');
        this.joinGame();
        this.reset();
      }.bind(this));
    } else {
      this.createLiveGame();
    }
  }

  Game.createLiveGame = function(){
    this.gameRef = this.gamesRef.push({created_at: (new Date()).getTime()});
    console.log('Created game', this.gameRef.name());
    Game.overlay('Share this URL to your date!');
    window.location.hash = '#' + this.gameRef.name();

    this.joinGame();
  }

  Game.joinGame = function () {
    console.timeEnd('firebase-connection');
    // todo: hook name to session ID
    this.playersRef = this.gameRef.child('players');
    // roles is a dictionary of role: userID.
    this.rolesRef = this.gameRef.child('roles');
    this.currentTurnRef = this.gameRef.child('currentTurnRef');
    this.currentTurnRef.on('value', function(snapshot){
      // returns the user id of the current user
      if (snapshot.val() && Game.getPlayerById(snapshot.val())){
        console.log('syncing player turn to ', snapshot.val());
        Game.setTurn(Game.getPlayerById(snapshot.val()));
      }
    });

    var myName = playerNames[Math.floor(Math.random() * playerNames.length)].replace(/\s/g, '');

    this.currentUserRef = this.playersRef.push({
      name: myName,
      state: 'joining'
    });

    this.userId = this.currentUserRef.name();

    console.log('Joining as', myName, '(' + this.userId + ')');


    this.playersRef.on('child_added', this.playerJoined);

    this.currentUserRef.child('state').onDisconnect().set('disconnected');

    // this is pretty insecure.  One player should not be able to delete another..
    this.framesRef = this.currentUserRef.child('frames');
    this.framesRef.onDisconnect().remove();

    this.watchRoles();
    this.setRole();
  }

  Game.watchRoles = function(){
    this.rolesRef.on('value', function(snapshot){
      var val = snapshot.val();
      this.player1.userId = val.player1;
      this.player2.userId = val.player2;


      // it would be neater to end the game here :-P
      if (this.player1.userId == this.userId) {
        Game.takeRole('player1');
      }else if (this.player2.userId == this.userId){
        Game.takeRole('player2');
      }else{
        console.log("Assigned role of observer")
        // Game.takeRole('observer');
      }
    }.bind(this));
  }

  Game.setRole = function(){
    this.rolesRef.transaction(function(roles){
      roles || (roles = {});

      // allow role override
      var role = getParam('role');
      if (role == 'player2'){
        roles.player2 = this.userId
      }else if (!roles.player1){
        roles.player1 = this.userId;
      }else if (!roles.player2){
        roles.player2 = this.userId;
      }
      return roles;
    }.bind(this));
  }

  Game.takeRole = function(roleName){
    console.log("Assigned as " + roleName);

    // allow another player to take this spot:
    this.rolesRef.child(roleName).onDisconnect().remove();

    var role = Game[roleName];
    role.setCamera();
  }


  Game.playerJoined = function(snapshot){
    if (snapshot.val().state == 'disconnected') return;

    // watch for disconnection:
    snapshot.ref().child('state').on('value', function(stateSnapshot){
      if (stateSnapshot.val() == 'disconnected') {
        stateSnapshot.ref().parent().once('value', function(playerSnapshot){
          Game.playerLeft(playerSnapshot);
        });
      }
    });

    if (snapshot.name() == this.currentUserRef.name()) {
      $('#player1 .name').html(snapshot.val().name); // where's the player name??
      this.streamFrames = true;
    }else{
      $('#player2 .name').html(snapshot.val().name);
      this.watchPlayer(snapshot);
    }
  }.bind(Game);


  Game.watchPlayer = function (snapshot) {
    console.log('Watching player', snapshot.val().name);
    console.log(snapshot, snapshot.val());
    if (!snapshot.val().name){
      console.warn("No player name on watched player", snapshot.name());
    }
    Game.playerCount++;

    // are frames actually removed here?
    this.playersRef.child(snapshot.name() + '/frames').limit(10).on('child_added', Game.receiveFrame);
  }

  Game.playerLeft = function(snapshot){
    console.log('Player ' + snapshot.val().name + ' has left the game');
    Game.playerCount--;

    LeapHandler.clearUser(snapshot.name());

    this.playersRef.child(snapshot.name() + '/frames').off('child_added', Game.receiveFrame);
  }.bind(Game);


  Game.shareFrameData = function (frame) {
    // we check streamFrames as it looks like it may take a moment for the ref to be ready
    if (!this.framesRef || !this.streamFrames) {
      return;
    }
    // clip old frame data after ~500 frames
    var frameData = {
      frame: {
        hands: frame.hands,
        pointables: frame.pointables,
        localTime: (new Date).getTime(),
        id: frame.id,
        currentFrameRate: frame.currentFrameRate,
      }
    }

//    if (Game.isMyTurn()){
//      frameData.frame.ballPosition = pongBall.position.toArray();
//    }

    this.recentSentFrameRefs.push(this.framesRef.push(frameData));

    // remove old frames from firebase
    if (this.recentSentFrameRefs.length > 10){
      this.recentSentFrameRefs.shift().remove();
    }
    this.framesSent++;
  }


  Game.receiveFrame = function (snapshot) {
    var userId = snapshot.ref().toString().match(/players\/(.+?)\//)[1];
    Game.framesReceived++;

    var frameData = snapshot.val().frame;

    var timeDifference = ((new Date).getTime() - frameData.localTime);

//    if (timeDifference > 10000) {
//      console.warn("dropping frame, " + timeDifference + "ms old");
//      return
//    }

    latencyHud.innerHTML = timeDifference + "ms";

    //    no leap or :
    //
    //    custom animation loop.  Watch pool of player frames. Combine. Call sendFrame.
    //
    //
    //    With Leap
    //
    //    on every rawFrame (in the record protocol), after sending, check pool of player frames, concat.

    LeapHandler.addUserFrame(userId, frameData);
  }.bind(this);


  Game.begin = function () {
    this.connectToLiveGame();
    Game.reset();
    window.render();
  };

  Game.setTurn = function(player) {
    if (this.turn == player) return;
    console.log(player.side + ' turn');
    this.turn = player;
    $('.turn').html('');
    $('#player' + player.index + ' .turn').html("'s turn ");
  };

  Game.toggleTurn = function(){
    if (Game.player1 && Game.player2){
      if (Game.turn === Game.player1) {
        Game.setTurn(Game.player2);
      } else if (Game.turn === Game.player2) {
        Game.setTurn(Game.player1);
      }
    }else{
      Game.setTurn(Game.player1);
    }
    pongBall.reset();
  }

  Game.isMyTurn = function(){
    return Game.turn.userId == Game.userId;
  }

  Game.reset = function() {
    this.player1.resetCups();
    this.player2.resetCups();
    pongBall.reset();
    this.setTurn(this.player1);
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