
      var myGamePiece, myScorePiece, myScore;
      var gameInfo = {
        clearedObj : 0,
        score: 0,
        frames: 0,
        gameRate: 10

      };
      var infoBoxes;
      var myObstacles = [];
      var resetKey = 13;

      function startGame() {
        infoBoxes ={
        clearedInfo : new infoBox(document.getElementById('walls-cleared'),gameInfo,"clearedObj"),
        score : new infoBox(document.getElementById('game-score'),gameInfo,"score"),
        frames : new infoBox(document.getElementById('game-frames'),myGameArea,"frameNo"),
        level: new infoBox(document.getElementById('game-level'),gameInfo,"gameRate"),

      }
        myScore = 0;
        myGameArea.start();
        gameInfo.gameRate = 10;
        myGamePiece = new component(30, 30, "#00ff00", 10, 120);
      }

      function updateGameArea() {
        var x, height, gap, minHeight, maxHeight, minGap, maxGap;
        //Check for collision
        for (var i = 0; i < myObstacles.length; i += 1) {
          if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
          }
        }
        myGameArea.clear();

        myGameArea.frameNo += 1;
        //Create new obstacles
        if (myGameArea.frameNo == 1 || everyinterval(150)) {
          x = myGameArea.canvas.width;
          minHeight = 20;
          maxHeight = 200;
          height = Math.floor(
            Math.random() * (maxHeight - minHeight + 1) + minHeight
          );
          minGap = 50;
          maxGap = 200;
          gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
          myObstacles.push(new component(10, height, "blue", x, 0));
          myObstacles.push(
            new component(10, x - height - gap, "blue", x, height + gap)
          );
        }
        //Move Obstacles
        for (var i = 0; i < myObstacles.length; i++) {
          myObstacles[i].x -= (1 * gameInfo.gameRate) / 10;
          //Remove Offscreen Obstacles and update score
          if (myObstacles[i].x < 0) {
            myObstacles.splice(i, 1);
            gameInfo.clearedObj += 1;
          }
          myObstacles[i].update();

        }

        //Mouse Activity
        /*if (myGameArea.x && myGameArea.y) {
                myGamePiece.x = myGameArea.x;
                myGamePiece.y = myGameArea.y;
              }*/
        //Use with keyboard and button actions

        myGamePiece.speedX = 0;
        myGamePiece.speedY = 0;
        if (myGameArea.keys && myGameArea.keys[37]) {
          myGamePiece.moveLeft();
        }
        if (myGameArea.keys && myGameArea.keys[38]) {
          myGamePiece.moveUp();
        }
        if (myGameArea.keys && myGameArea.keys[39]) {
          myGamePiece.moveRight();
        }
        if (myGameArea.keys && myGameArea.keys[40]) {
          myGamePiece.moveDown();
        }
        //Change Speed
        if (myGameArea.keys && myGameArea.keys[109]) {
          if  (gameInfo.gameRate > 10) {
            myGameArea.changeSpeed(-1);
          }
        }
        if (myGameArea.keys && myGameArea.keys[107]) {
          if  (gameInfo.gameRate < 100) {
            myGameArea.changeSpeed(1);
          }
        }
        //Reset Game
        if (myGameArea.keys && myGameArea.keys[resetKey]) {
          myGameArea.reset();
        }
        //Increase score accumulation rate as gamepiece moves towards right side and in proportion with gamerate
        gameInfo.score += Math.floor(
          (myGamePiece.x * 2) / myGameArea.canvas.width + (1 * gameInfo.gameRate) / 10
        );
        //   myScorePiece.text = "SCORE: " + myScore + " frames: " + myGameArea.frameNo;
        updateObjectProperties(infoBoxes);
        myGamePiece.newPos();
        myGamePiece.update();
      }

      var myGameArea = {
        canvas: document.createElement("canvas"),
        start: function() {
          //Setup Canvas Size and Location
          this.canvas.width = 480;
          this.canvas.height = 270;
          this.canvas.style.margin = "auto";
          this.context = this.canvas.getContext("2d");
          var canvasHolder = document.getElementById("bottomrow");
          canvasHolder.appendChild(this.canvas);
          //Reload the game every 20ms
          this.frameNo = 0;
          this.interval = setInterval(updateGameArea, 20);

          //Setup Check for keyboard activity
          window.addEventListener("keydown", function(e) {
            if (e.keyCode == resetKey) {
              myGameArea.reset();
            }
            myGameArea.keys = myGameArea.keys || [];
            myGameArea.keys[e.keyCode] = true;
          });
          window.addEventListener("keyup", function(e) {
            myGameArea.keys[e.keyCode] = false;
          });
          //Setup Check for mouse action

          /*this.canvas.style.cursor = "none";
                window.addEventListener('mousemove', function(e) {
                myGameArea.x = e.pageX;
                myGameArea.y = e.pageY;
                })*/
        },
        clear: function() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop: function() {
          clearInterval(this.interval);
        },
        reset: function() {
          this.stop();
          this.clear();
          this.canvas.parentNode.removeChild(this.canvas);
          myObstacles = [];
          startGame();
        },
        changeSpeed: function(speedChange) {
         gameInfo.gameRate += speedChange;
        }
      };

      function everyinterval(n) {
        if (((myGameArea.frameNo * Math.floor (gameInfo.gameRate / 10)) / n) % 1 == 0) {
          return true;
        }
        return false;
      }


       
      


      function component(width, height, color, x, y, type) {
        this.type = type;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.update = function() {
          ctx = myGameArea.context;
          ctx.fillStyle = color;

          if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillText(this.text, this.x, this.y);
          } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
          }
        };

        this.newPos = function() {
          this.x += this.speedX;
          this.y += this.speedY;
        };
        this.moveLeft = function() {
          this.speedX -= (1 * gameInfo.gameRate) / 10;
        };
        this.moveRight = function() {
          this.speedX += (1 * gameInfo.gameRate) / 10;
        };
        this.moveUp = function() {
          this.speedY -= (1 * gameInfo.gameRate) / 10;
        };
        this.moveDown = function() {
          this.speedY += (1 * gameInfo.gameRate) / 10;
        };
        function stopMove() {
          this.speedX = 0;
          this.speedy = 0;
        }
        this.crashWith = function(otherobj) {
          var myleft = this.x;
          var myright = this.x + this.width;
          var mytop = this.y;
          var mybottom = this.y + this.height;
          var otherleft = otherobj.x;
          var otherright = otherobj.x + otherobj.width;
          var othertop = otherobj.y;
          var otherbottom = otherobj.y + otherobj.height;
          var crash = true;
          if (
            mybottom < othertop ||
            mytop > otherbottom ||
            myright < otherleft ||
            myleft > otherright
          ) {
            crash = false;
          }
          return crash;
        };
      }

      /**
       * @description - Creates an object that connects a DOM element to a game stat
       *
       * @param {object} e - element on page to display value in
       * @param {object} infoObject - Object holding info
       * @param {string} propertyToShow - property name storing info
       */
      function infoBox(e, infoObject, propertyToShow){
        //element to update, object containing property, property key
        this.e = e;
        this.object = infoObject;
        this.property = propertyToShow   
        this.update = function(){
          var r = this.object[this.property];
          e.innerHTML = r;
        }
      }

      /**
       * @description - Calls the update function on every property of an object or through an array of property names if provided
       *
       * @param {object} obj - Object with properties that have update functions
       * @param {string[]} propertyNames - Optional propertynames to update only some properties
       */
function updateObjectProperties(obj, propertyNames) {
    if (!propertyNames) {
        Object.keys(obj).forEach(function (key) {
            obj[key].update();
        });
    }
    else {
        propertyNames.forEach(function(propertyName){
            obj[propertyName].update();
        })    
    }
}