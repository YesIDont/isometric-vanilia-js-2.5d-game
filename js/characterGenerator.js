// Player character / NPC / monster creator

// var playerSprite = new Image();
// playerSprite.src = "https://github.com/lostdecade/simple_canvas_game/blob/master/images/hero.png?raw=true";

function createCharacter(playerSpeedInPx){
  var that = this;

  this.spriteSheet = {
    // path, x, y, rows, columns, frames number, scale in %, type, holdTime
    idle: new createSprite(
      // path
      "img/characters/player-idle.png",      
      -9, -40,     // x and y pos of animation (top left corner), for 100% scale of sprite: 3, -11
      8, 4,       // rows, columns   
      4,          // number of frames in row to animate         
      24,         // dalay in frames without sprite frame update
      82,              // scale in %      
      "breathing",     // type - for now: simple (from left to right), and breathing (left to right, hold and back in revers order)
      36,              // hold time for breathing animation
      // array of directions
      // order: 0 face bottom, 1 left bottom, 2 left, 3 left top, 4 top, 5 right top, 6 right, 7 right bottom
      // numbers show how many frame height will be multiplied to get offset for one animation
      [5, 6, 7, 0, 1, 2, 3, 4]   
    ),
    run: new createSprite(
      // path
      "img/characters/player-run.png",
      -9, -40,     // x and y pos of animation (top left corner)      
      8, 8,       // rows, columns   
      8,          // number of rames in row to animate         
      6,         // dalay in fframes without sprite frame update
      82,              // scale in %      
      "simple",     // type - for now: simple (from left to right), and breathing (left to right, hold and back in revers order)
      0,              // hold time for breathing animation
      [6, 7, 0, 1, 2, 3, 4, 5]   
    ),
    direction: 0 // 0 face bottom, 1 left bottom, 2 left, 3 left top, 4 top, 5 right top, 6 right, 7 right bottom
  }; 
  this.spriteWidth = 32; //this.sprite.naturalWidth;
  this.spriteHeight = 32; //this.sprite.naturalHeight;
  this.spriteCenter = {
    x: 16, //Math.floor(this.spriteWidth * 0.5),
    y: 32
  };

  this.x = 0; // map x position
  this.y = 0; // map y position
  this.z = 0; // map z position

  this.speed = playerSpeedInPx;
  this.weight = 4; // draws the line for how fast object can be falling
  this.isInTheAir = false;
  this.isJumping = false;
  this.jumpDistance = 2;
  this.jumpHeight = 6;
  this.jumpDelay = 15;
  this.jumpDelayCounter = 0;
  this.xV = 0; // horizontal velocity
  this.yV = 0;  // vertical velocity
  this.zV = 0;  // velocity of player in the air, player can't move while in the air
  
  this.collisionDetected = false;
  this.lastTileStoodOn = {};

  // on how much higher tile player can step without jumping (in px)
  this.maxStepWithoutJump = 15;
  this.lastLog = "";
  this.lastTileLogged = {};
  this.log = {
    that: this,
    position: false,
    collision: false,
    switch: function (i) {
      i = i === true ? false : true;
      return i;
    },
    properties: function(messageLable) {
      var p = this.that,
          t = p.lastTileStoodOn,
          ms = messageLable || "",
    //       whatToLog = `${ms}
    // x: ${p.x}
    // y: ${p.y}
    // z: ${p.z}
    // xV: ${p.xV}
    // yV: ${p.yV}
    // zV: ${p.zV}
    // tile.z: ${t.z}
    // tile: ${t.r} ${t.c}
    // falling: ${p.isInTheAir}
    // col: ${p.collisionDetected}
    // `;
            whatToLog = 
            ms +
            " | xV: " + p.xV +
            " x: " + p.x +
            " | yV: " + p.yV +
            " y: " + p.y +
            " | z.V: " + p.zV +
            " z: " + p.z +
            " | tile.z: " + t.z +
            " tile: " + t.r + ", " + t.c +
            " | falling: " + p.isInTheAir +
            " | col: " + p.collisionDetected;

      if ( !this.lastLog || whatToLog !== this.lastLog ) {
        console.log(whatToLog);
      }
      this.lastLog = whatToLog;
    }
  }
};

// Methods

createCharacter.prototype.startPosition = function(xS, yS, zS) {
  this.x = xS;
  this.y = yS;
  this.z = zS;
};

createCharacter.prototype.animate = function(ctx) {
  var p = this;
  var run = p.spriteSheet.run;
  var idle = p.spriteSheet.idle;
  var x = this.x;
  var y = this.y;
  var z = this.z;

  // change sprite direction depending on key configuration pressed
  if(p.yV > 0 && p.xV === 0) {
    p.spriteSheet.direction = 0;
  } 
  if(p.yV > 0 && p.xV < 0) {
    p.spriteSheet.direction = 1;
  }
  if(p.yV === 0 && p.xV < 0) {
    p.spriteSheet.direction = 2;
  }
  if(p.yV < 0 && p.xV < 0) {
    p.spriteSheet.direction = 3;
  }
  if(p.yV < 0 && p.xV === 0) {
    p.spriteSheet.direction = 4;
  }
  if(p.yV < 0 && p.xV > 0) {
    p.spriteSheet.direction = 5;
  }
  if(p.yV === 0 && p.xV > 0) {
    p.spriteSheet.direction = 6;
  }
  if(p.yV > 0 && p.xV > 0) {
    p.spriteSheet.direction = 7;
  }

  // draw frame based on player's action
  if(p.xV !== 0 || p.yV !== 0) {
    run.updateFrame(run);
    run.drawFrame(p, run, x, y + z, ctx);
  } else {
    idle.updateFrame(idle);
    idle.drawFrame(p, idle, x, y + z, ctx);
  }
};

createCharacter.prototype.showPosition = function(ctx, mapObject, color) {
  var that = this;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(that.x, 0);
  ctx.lineTo(that.x, mapObject.mapHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, that.y);
  ctx.lineTo(mapObject.mapWidth, that.y);
  ctx.stroke();
};

createCharacter.prototype.whichTileIsStandingOn = function() {
  var p = this;
  var m = map;
  var cm = p.collisionModel; 

  for(r = cm.area.top; r < m.tiles.length - cm.area.bottom; r++) {
    if(r >= 0 && r < m.tiles.length) {
      for(c = cm.area.left; c < m.tiles[r].length - cm.area.right; c++) {
        if(c >= 0 && c < m.tiles[r].length) {
          if(m.tiles[r][c].x > cm.area.points.topLeft.x &&
            m.tiles[r][c].x + m.tileWidth < cm.area.points.bottomRight.x &&
            m.tiles[r][c].y > cm.area.points.topLeft.y &&
            m.tiles[r][c].y + m.tileHeight < cm.area.points.bottomRight.y) {

              var t = m.tiles[r][c],
                  player = cm.base.point,
                  tile = t.base,
                  response = new SAT.Response(),
                  collision;
              response.clear();

              // test collision
              collision = player.collidesWith(tile, response);

              if( collision ) {
                // t.playerStandsOnIt = true;
                // p.lastTileStoodOn = t;
                
                return t;
            }
          }
        }
      }
    }
  }
}

// log shit & stuff about character's object

// Update player's collision box and area per axis
createCharacter.prototype.upX = function(m, p) {
  // Move player's collision box
  p.collisionModel.base.poly.pos.x += p.xV;
  p.collisionModel.base.point.pos.x += p.xV;


  //Move player's collision area
  p.collisionModel.area.points.topLeft.x += p.xV;
  p.collisionModel.area.left = Math.floor(p.collisionModel.area.points.topLeft.x / m.tileWidth);
  p.collisionModel.area.points.bottomRight.x += p.xV;
  p.collisionModel.area.right = Math.floor((m.mapWidth - p.collisionModel.area.points.bottomRight.x) / m.tileWidth);
}
createCharacter.prototype.upY = function(m, p) {
  // Move player's collision box
  p.collisionModel.base.poly.pos.y += p.yV;
  p.collisionModel.base.point.pos.y += p.yV;

  //Move player's collision area
  p.collisionModel.area.points.topLeft.y += p.yV;
  p.collisionModel.area.top = Math.floor(p.collisionModel.area.points.topLeft.y / m.tileHeight);
  p.collisionModel.area.points.bottomRight.y += p.yV;
  p.collisionModel.area.bottom = Math.floor((m.mapHeight - p.collisionModel.area.points.bottomRight.y) / m.tileHeight);
}
createCharacter.prototype.upZ = function(m, p) {
  // Move player's collision box
  p.collisionModel.base.poly.pos.y += p.zV;
  p.collisionModel.base.point.pos.y += p.zV;

  //Move player's collision area
  p.collisionModel.area.points.topLeft.y += p.zV;
  p.collisionModel.area.top = Math.floor(p.collisionModel.area.points.topLeft.y / m.tileHeight);
  p.collisionModel.area.points.bottomRight.y += p.zV;
  p.collisionModel.area.bottom = Math.floor((m.mapHeight - p.collisionModel.area.points.bottomRight.y) / m.tileHeight);
}



createCharacter.prototype.calcCollisionModel = function(mapObject, playerObject) {
  //characters base for interactions

  this.m = mapObject;
  this.p = playerObject;

  this.base = {
    x: this.p.x -12,
    y: this.p.y - 11,

    width: 22,
    height: 22,

    poly: new P(new V(this.p.x -12, this.p.y - 11), [
      new V(1, 11),   // left
      new V(11, 17),  // bottom
      new V(22, 11),  // right
      new V(11, 5)    // top
    ]),

    point: new P(new V(this.p.x - 1, this.p.y - 1), [
      new V(1, 1),
      new V(1, 1),
      new V(1, 1),
      new V(1, 1)
    ])
  };

  /*
      Below offset alows for alternative collision calculation. Usualy all tiles
      would have to be checked against coordinates of player's character colision area.
      Below offset allows to narrow down loop of all map tiles to choose those next to te player's character
      by substracting desired tiles indexes in rows and columns from tiles array.
  */
  // numbers of tiles used to offset tile array loop
  this.areaDimensions = {
    width: 1.5 * mapObject.tileWidth , // half of the area in x tiles wide
    height: 2 * mapObject.tileHeight, // half of the area in x tiles tall
  };
  this.area = {
    points: {
      topLeft: {
        x: playerObject.x - this.areaDimensions.width,
        y: playerObject.y - this.areaDimensions.height
      },
      bottomRight: {
        x: playerObject.x + this.areaDimensions.width,
        y: playerObject.y + this.areaDimensions.height
      }
    },

    // map offset in tiles, will be used to offset detection area for this character
    top: Math.floor((playerObject.y - this.areaDimensions.height) / mapObject.tileHeight),

    right: Math.floor((mapObject.mapWidth - (playerObject.x + this.areaDimensions.width)) / mapObject.tileWidth),

    bottom: Math.floor(((mapObject.mapHeight - playerObject.y) - this.areaDimensions.width) / mapObject.tileHeight), 

    left: Math.floor((playerObject.x - this.areaDimensions.width) / mapObject.tileWidth),
  };

  this.response = "";

  this.areaLoop = function(mapObject, playerObject, callback) {
    var m = mapObject;
    var p = playerObject;
    var cm = p.collisionModel;

    // loop through rows of tiles of the layer that player is currently on
    // but only through tiles next to player
    for(r = cm.area.top; r < m.tiles.length - cm.area.bottom; r++) {

      // proceed only if tiles are in range of array lenght, offset can be nagative and would break the loop
      if(r >= 0 && r < m.tiles.length) {

        // loop through narrowed range of columns ir row
        for(c = cm.area.left; c < m.tiles[r].length - cm.area.right; c++) {

          // proceed only if tiles are in range of array lenght
          if(c >= 0 && c < m.tiles[r].length) {

            // continue only if the tiles are entirely in the collision check area
            if(m.tiles[r][c].x > cm.area.points.topLeft.x &&
              m.tiles[r][c].x + m.tileWidth < cm.area.points.bottomRight.x &&
              m.tiles[r][c].y > cm.area.points.topLeft.y &&
              m.tiles[r][c].y + m.tileHeight < cm.area.points.bottomRight.y) {
                callback();
            }
          }  
        }
      }
    }
  };

  this.drawArea = function(mapObject, playerObject, ctx) {
    var m = mapObject;
    var p = playerObject;
    var cm = p.collisionModel;

    // loop through rows of tiles of the layer that player is currently on
    // but only through tiles next to player
    for(r = cm.area.top; r < m.tiles.length - cm.area.bottom; r++) {

      // proceed only if tiles are in range of array lenght, offset can be nagative and would break the loop
      if(r >= 0 && r < m.tiles.length) {

        // loop through narrowed range of columns ir row
        for(c = cm.area.left; c < m.tiles[r].length - cm.area.right; c++) {

          // proceed only if tiles are in range of array lenght
          if(c >= 0 && c < m.tiles[r].length) {
            var t = m.tiles[r][c];
            // continue only if the tiles are entirely in the collision check area
            if(t.x > cm.area.points.topLeft.x &&
              t.x + m.tileWidth < cm.area.points.bottomRight.x &&
              t.y > cm.area.points.topLeft.y &&
              t.y + m.tileHeight < cm.area.points.bottomRight.y) {

                // fill collision area
                m.fillOneTileBase(ctx, "rgba(89, 178, 234, 0.3)", r, c);

                // fill base of tiles that could be / are colliding with player
                if( t.z < p.z - p.maxStepWithoutJump || t.z > p.z + p.maxStepWithoutJump ) {
                  m.fillOneTileBase(ctx, "rgba(255, 0, 0, 0.4)", r, c);
                }
                var player = cm.base.poly;
                var tile = t.base;

                var response = new SAT.Response();
                response.clear();

                // test collision
                p.collisionDetected = player.collidesWith(tile, response);

                // fill tile that player is currently standing on
                if(p.collisionDetected) {
                  m.fillOneTileBase(ctx, "rgba(0, 255, 0, 0.3)", r, c);
                }
            }
          }
        }
      }
    }
  };

  this.singleTileTest = function(mapObject, playerObject, r, c) {
    var that = this;
    var m = mapObject;
    var p = playerObject;
    var cm = p.collisionModel;

    var bol = false;

    // set variables for collision test
    var player = cm.base.poly;
    var polygon = m.tiles[r][c].base;

    var response = new SAT.Response();
    response.clear();

    // test collision
    p.collisionDetected = player.collidesWith(polygon, response);

    // write if player is standing on this tile
    if(p.collisionDetected) {
      bol = true;
    }
    return bol;
  };

  this.testPosition = function(m, p) {
    var that = this;
    // m = mapObject;
    // p = playerObject;
    var cm = p.collisionModel; 

    // loop through rows of tiles of the layer that player is currently on
    // but only through tiles next to player
    for(r = cm.area.top; r < m.tiles.length - cm.area.bottom; r++) {

      // proceed only if tiles are in range of tiles array lenght, offset can be nagative and would break the loop
      if(r >= 0 && r < m.tiles.length) {

        // loop through narrowed range of columns ir row
        for(c = cm.area.left; c < m.tiles[r].length - cm.area.right; c++) {

          // proceed only if tiles are in range of tiles array lenght
          if(c >= 0 && c < m.tiles[r].length) {
            var t = m.tiles[r][c];

            // continue only if tile is entirely in the collision check area
            if(t.x > cm.area.points.topLeft.x &&
              t.x + m.tileWidth < cm.area.points.bottomRight.x &&
              t.y > cm.area.points.topLeft.y &&
              t.y + m.tileHeight < cm.area.points.bottomRight.y) {

                  // set variables for collision test
                  var player = cm.base.poly;
                  var tile = t.base;

                  var response = new SAT.Response();
                  response.clear();

                  // test collision
                  p.collisionDetected = player.collidesWith(tile, response);

                  if( p.collisionDetected ) {

                    // counter movment if collision detected
                    if( t.z < p.z ) {

                      if ( t.z > p.z - p.maxStepWithoutJump ) {
                        if ( p.xV !== 0 || p.yV !== 0 ) {
                          p.z -= 10;
                        }
                      }
                      else {
                        p.collisionDetected = true;

                        if ( p.log.collision ) { p.log.properties("c") }

                        var model = p.collisionModel;
                        var rex = Math.round(response.overlapV.x);
                        var rey = Math.round(response.overlapV.y);

                        // player position
                        p.x -= rex;
                        p.y -= rey;

                        // player's collision box position
                        model.base.poly.pos.x -= rex;
                        model.base.poly.pos.y -= rey;

                        // player's collision point position
                        model.base.point.pos.x -= rex;
                        model.base.point.pos.y -= rey;

                        // player's collision area position
                        model.area.points.topLeft.x -= rex;
                        model.area.points.topLeft.y -= rey;
                        model.area.points.bottomRight.x -= rex;
                        model.area.points.bottomRight.y -= rey;
                      }
                    }
                    else {
                      p.collisionDetected = false;
                    }
              }     
            }
          }
        }
      }
    }
  }
}

createCharacter.prototype.move = function(m, p) {
  // p = playerObject;
  // m = mapObject;

  // current tile
  var l = p.lastTileStoodOn;
  p.lastTileStoodOn = p.whichTileIsStandingOn();
  
  p.xV = 0;
  p.yV = 0;

  if ( p.z < l.z ) {
    p.zV = p.zV < p.weight ? p.zV + 1 : p.weight; // basic gravity, weight draws the line of max vertical falling speed
    p.isInTheAir = true;

  } else {
    if ( p.zV !== 0 ) { // this prevents repeating zeroing operation if not neccesary
      p.zV = 0;
    }
    p.isInTheAir = false;
    p.isJumping = false;
    p.jumpDelayCounter = p.jumpDelayCounter - 1 >= 0 ? p.jumpDelayCounter - 1 : 0;
  }

  // Player is holding spacebar (jump) key
  if ( 32 in keysDown && !p.isInTheAir && p.jumpDelayCounter === 0 && p.zV === 0 ) {
    p.zV = -p.jumpHeight;
    p.jumpDelayCounter = p.jumpDelay;
    p.isJumping = true;
    if ( p.log.position ) { p.log.properties("j") }
  }

  // Player holding left key
  if ( 37 in keysDown  ){
    // Move player if he's in the range of map
    if(p.x > (m.clipByTiles * m.tileWidth) + p.xV + (p.spriteWidth / 2) && p.x < m.mapWidth - (m.clipByTiles * m.tileWidth)) {
      // Move player
      p.xV -= p.speed;
      if ( p.isJumping ) { p.xV -= p.jumpDistance }
    }
  }

  // Player holding key right
  if ( 39 in keysDown ) {
    // Move player if he's in the range of map
    if(p.x > (m.clipByTiles * m.tileWidth) +  p.xV && p.x < m.mapWidth - (m.clipByTiles * m.tileWidth) - (p.spriteWidth / 2)) {
      // Move player
      p.xV += p.speed;
      if ( p.isJumping ) { p.xV += p.jumpDistance }
    }
  }

  // Player holding key up
  if ( 38 in keysDown ) {
    // Move player if he's in the range of map
    if(p.y > (m.clipByTiles * m.tileHeight) + p.yV + p.spriteHeight + p.spriteHeight && p.y < m.mapHeight - (m.clipByTiles * m.tileWidth)) {
      // Move player
      p.yV -= p.speed;
      if ( p.isJumping ) { p.yV -= p.jumpDistance }
    }
  }

  // Player holding key down
  // Move player if he's in the range of map
  if ( 40 in keysDown && p.y > m.clipByTiles * m.tileHeight + p.yV && p.y < m.mapHeight - (m.clipByTiles * m.tileWidth) - 4) {
    // Move player
    p.yV += p.speed;
    if ( p.isJumping ) { p.yV += p.jumpDistance }

  }


  // p.z update logic

  if ( p.isInTheAir ) {
    if ( Math.abs( p.z - l.z ) > p.weight ) {
      p.z += p.zV;
    } else {
      p.z += Math.abs( p.z - l.z );
    }
  } else {
    p.z += p.zV;
  }

  p.y += p.yV;
  p.x += p.xV;

  if ( p.log.position ) { p.log.properties("g") }
  
  // p.upZ(m, p);
  p.upY(m, p);
  p.upX(m, p);

  p.lastTileLogged = l;
}