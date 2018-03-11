// Player character / NPC / monster creator

// let playerSprite = new Image();
// playerSprite.src = "https://github.com/lostdecade/simple_canvas_game/blob/master/images/hero.png?raw=true";

function createCharacter(playerSpeedInPx){
  let that = this;

  this.spriteSheet = {
    // path, x, y, rows, columns, frames number, scale in %, type, holdTime
    idle: new createSprite(
      // path
      "img/characters/player-idle.png",      
      -9, -35,     // x and y pos of animation (top left corner), for 100% scale of sprite: 3, -11
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
      -9, -35,     // x and y pos of animation (top left corner)      
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
  this.xV = 0; // horizontal velocity
  this.yV = 0;  // vertical velocity
  this.zV = 0;  // velocity of player in the air, player can't move while in the air
  
  this.collisionDetected = false;
  this.lastTileStoodOn = [0, 0]
};

// Methods

createCharacter.prototype.startPosition = function(xS, yS, zS) {
  this.x = xS;
  this.y = yS;
  this.z = zS;
};

createCharacter.prototype.animate = function(ctx) {
  let p = this;
  let run = p.spriteSheet.run;
  let idle = p.spriteSheet.idle;
  let x = this.x;
  let y = this.y;
  let z = this.z;

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

createCharacter.prototype.pinPoint = function(ctx, mapObject, color) {
  let that = this;
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
      new V(1, 1),
      new V(22, 1),
      new V(22, 11),
      new V(1, 11)
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
    let m = mapObject;
    let p = playerObject;
    let cm = p.collisionModel;

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
    let m = mapObject;
    let p = playerObject;
    let cm = p.collisionModel;

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

                // // fill collision area
                // m.fillOneTileBase(ctx, "rgba(89, 178, 234, 0.3)", r, c);

                // fill base of tiles that could be / are colliding with player
                if( m.tiles[r][c].z > p.z + 10 || m.tiles[r][c].z < p.z - 10 ) {
                  m.fillOneTileBase(ctx, "rgba(255, 0, 0, 0.4)", r, c);
                }
                let player = cm.base.point;
                let tile = m.tiles[r][c].base;

                let response = new SAT.Response();
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

  this.testPosition = function(mapObject, playerObject) {
    let that = this;
    let m = mapObject;
    let p = playerObject;
    let cm = p.collisionModel;

    // loop through rows of tiles of the layer that player is currently on
    // but only through tiles next to player
    for(r = cm.area.top; r < m.tiles.length - cm.area.bottom; r++) {

      // proceed only if tiles are in range of tiles array lenght, offset can be nagative and would break the loop
      if(r >= 0 && r < m.tiles.length) {

        // loop through narrowed range of columns ir row
        for(c = cm.area.left; c < m.tiles[r].length - cm.area.right; c++) {

          // proceed only if tiles are in range of tiles array lenght
          if(c >= 0 && c < m.tiles[r].length) {

            // continue only if tile is entirely in the collision check area
            if(m.tiles[r][c].x > cm.area.points.topLeft.x &&
              m.tiles[r][c].x + m.tileWidth < cm.area.points.bottomRight.x &&
              m.tiles[r][c].y > cm.area.points.topLeft.y &&
              m.tiles[r][c].y + m.tileHeight < cm.area.points.bottomRight.y) {

                // continue to SAT collision test if given tile is on different map level +/- 10 than player
                // and tile is higher than player
                if( m.tiles[r][c].z < p.z && ( m.tiles[r][c].z > p.z + 10 || m.tiles[r][c].z < p.z - 10 ) ) {

                  // set variables for collision test
                  let player = cm.base.poly;
                  let tile = m.tiles[r][c].base;

                  let response = new SAT.Response();
                  response.clear();

                  // test collision
                  p.collisionDetected = player.collidesWith(tile, response);

                  // counter movment if collision detected
                  if( p.collisionDetected  ) {
                    let model = p.collisionModel;
                    let rex = Math.round(response.overlapV.x);
                    let rey = Math.round(response.overlapV.y);

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

                // if tile is on the same level as player
                // or tile is lower
                } else {
                  // set variables for collision test
                  // testing one pxel of player's x and y position
                  let player = cm.base.point; 
                  let tile = m.tiles[r][c].base;

                  let response = new SAT.Response();
                  response.clear();

                  // test collision
                  p.collisionDetected = player.collidesWith(tile, response);

                  // if collision was detected
                  if( p.collisionDetected ) {                    
                    
                    if( m.tiles[r][c].z !== p.z && ( 37 in keysDown || 38 in keysDown || 39 in keysDown || 40 in keysDown ) ) {

                      if( Math.abs( p.z - m.tiles[r][c].z ) >= 10 ) {
                        p.zV = 5;

                      } else {
                        p.z = m.tiles[r][c].z;
                      }          

                    }
                    m.tiles[r][c].playerStandsOnIt = true;
                    p.lastTileStoodOn = [r, c];
                    
                  } else {
                    m.tiles[r][c].playerStandsOnIt = false;
                  }
                }  
              }    
            }
          }           
        }
      }
    };

  this.singleTileTest = function(mapObject, playerObject, r, c) {
    let that = this;
    let m = mapObject;
    let p = playerObject;
    let cm = p.collisionModel;

    let bol = false;

    // set variables for collision test
    let player = cm.base.poly;
    let polygon = m.tiles[r][c].base;

    let response = new SAT.Response();
    response.clear();

    // test collision
    p.collisionDetected = player.collidesWith(polygon, response);

    // write if player is standing on this tile
    if(p.collisionDetected) {
      bol = true;
    }
    return bol;
  };
};

createCharacter.prototype.move = function(mapObject, playerObject) {
  let p = playerObject;
  let m = mapObject;
  let l = m.tiles[ p.lastTileStoodOn[0] ][ p.lastTileStoodOn[1] ];
  
  // reset velocity build up in the last frame
  p.xV = 0;
  p.yV = 0;

  p.z = p.z < l.z ? p.z + p.zV : p.z = l.z;

  if(p.z !== l.z) {
    p.zV = Math.floor( p.zV *= 0.8 ) > 3 ? Math.floor( p.zV *= 0.8 ) : 3; // gravity
  } else {  

    // Player holding left key
    if (37 in keysDown){
      // Move player if he's in the range of map
      if(p.x > (m.clipByTiles * m.tileWidth) + p.xV + (p.spriteWidth / 2) && p.x < m.mapWidth - (m.clipByTiles * m.tileWidth)) {     

        // Move player
        p.xV -= p.speed;
        p.x += p.xV;

        // Move player's collision box
        p.collisionModel.base.poly.pos.x += p.xV;
        p.collisionModel.base.point.pos.x += p.xV;

        //Move player's collision area
        p.collisionModel.area.points.topLeft.x += p.xV;
        p.collisionModel.area.left = Math.floor(p.collisionModel.area.points.topLeft.x / m.tileWidth);
        p.collisionModel.area.points.bottomRight.x += p.xV;
        p.collisionModel.area.right = Math.floor((m.mapWidth - p.collisionModel.area.points.bottomRight.x) / m.tileWidth);
      };
    };
    
    // Player holding key right
    if (39 in keysDown) {
        // Move player if he's in the range of map
        if(p.x > (m.clipByTiles * m.tileWidth) +  p.xV && p.x < m.mapWidth - (m.clipByTiles * m.tileWidth) - (p.spriteWidth / 2)) {
          
          // Move player
          p.xV += p.speed;
          p.x += p.xV;

          // Move player's collision box
          p.collisionModel.base.poly.pos.x += p.xV;
          p.collisionModel.base.point.pos.x += p.xV;

          //Move player's collision area
          p.collisionModel.area.points.topLeft.x += p.xV;
          p.collisionModel.area.left = Math.floor(p.collisionModel.area.points.topLeft.x / m.tileWidth);
          p.collisionModel.area.points.bottomRight.x += p.xV;
          p.collisionModel.area.right = Math.floor((m.mapWidth - p.collisionModel.area.points.bottomRight.x) / m.tileWidth);       
        };     
    };  
    
    // Player holding key up
    if (38 in keysDown) {
      // Move player if he's in the range of map
      if(p.y > (m.clipByTiles * m.tileHeight) + p.yV + p.spriteHeight + p.spriteHeight && p.y < m.mapHeight - (m.clipByTiles * m.tileWidth)) {
        
        // Move player
        p.yV -= p.speed;
        p.y += p.yV;

        // Move player's collision box
        p.collisionModel.base.poly.pos.y += p.yV;
        p.collisionModel.base.point.pos.y += p.yV;

        //Move player's collision area
        p.collisionModel.area.points.topLeft.y += p.yV;
        p.collisionModel.area.top = Math.floor(p.collisionModel.area.points.topLeft.y / m.tileHeight);
        p.collisionModel.area.points.bottomRight.y += p.yV;
        p.collisionModel.area.bottom = Math.floor((m.mapHeight - p.collisionModel.area.points.bottomRight.y) / m.tileHeight);
      };
    };
    
    
    // Player holding key down
    if (40 in keysDown) {
      // Move player if he's in the range of map
      if(p.y > m.clipByTiles * m.tileHeight + p.yV && p.y < m.mapHeight - (m.clipByTiles * m.tileWidth) - 4) {
        
        // Move player
        p.yV += p.speed;
        p.y += p.speed;

        // Move player's collision box
        p.collisionModel.base.poly.pos.y += p.yV;
        p.collisionModel.base.point.pos.y += p.yV;

        //Move player's collision area
        p.collisionModel.area.points.topLeft.y += p.yV;
        p.collisionModel.area.top = Math.floor(p.collisionModel.area.points.topLeft.y / m.tileHeight);
        p.collisionModel.area.points.bottomRight.y += p.yV;
        p.collisionModel.area.bottom = Math.floor((m.mapHeight - p.collisionModel.area.points.bottomRight.y) / m.tileHeight);
      };
    }
  }
}