// links of images used for tiles
let grass         = new Image(),
    grasslight    = new Image(),
    grassdark     = new Image(),
    dirtblack     = new Image(),
    dirtblacklong = new Image(),
    cobblestone   = new Image(),
    lava          = new Image(),
    white         = new Image(),

    tilePath = "img/map/tiles/";

grass.src         = tilePath + "grass.png",
grasslight.src    = tilePath + "grass_light.png",
grassdark.src     = tilePath + "grass_dark.png",
dirtblack.src     = tilePath + "dirt_black.png",
dirtblacklong.src = tilePath + "dirt_black_long.png",
cobblestone.src   = tilePath + "cobblestone.png",
lava.src          = tilePath + "lava.png",
white.src         = tilePath + "white.png";

function generateMap (
    // input
    xTilesNumber,
    yTilesNumber,
    tileWidth,
    tileHeight,
    /*
        Starting position is used to calculate map offset in relation to canvas.
        Can be intergers in range of map width and height, and if typed outside thiese ranges -
        default position will be set, which is top left corner of the map in the top left corner of the canvas.
        Also accepts: top, bottom, left, right, center for both variables.

        For now it can take only center, center.
    */
    mapStartPosition_x,
    mapStartPosition_y,
    clipByTiles
    ) {

  let that = this;
  // Map basic properties
  this.xTilesNumber = xTilesNumber; // how many tiles horizontaly
  this.yTilesNumber = yTilesNumber; // how many tiles verticaly
  this.tileWidth = tileWidth;
  this.tileHeight = tileHeight;
  this.tileWidthHalf = Math.floor(tileWidth * 0.5);
  this.tileHeightHalf = Math.floor(tileHeight * 0.5);
  this.mapWidth = xTilesNumber * this.tileWidth + this.tileWidthHalf;
  // tile height must be devided into halfas tiles are placed verticaly evry half of their height to reduce otherwise gap betwen even and uneven rows
  this.mapHeight = yTilesNumber * Math.floor(this.tileHeight * 0.5) + that.tileHeightHalf;
  this.mapWidthHalf = Math.floor(this.mapWidth * 0.5);
  this.mapHeightHalf = Math.floor(this.mapHeight * 0.5);
  this.zMax = 0;
  this.zMin = 0;
  this.startPosition_x = mapStartPosition_x;
  this.startPosition_y = mapStartPosition_y;
  this.clipByTiles = clipByTiles || 0; // it tels animating function how many tiles must be clipped out of movment area
  // this.xStartOffset = Math.floor((this.mapWidth * 0.5)) - canvasWidthHalf; // on start centers map horizontaly
  // this.yStartOffset = Math.floor((this.mapHeight * 0.5)) - canvasHeightHalf; // on start centers map verticaly

  /*
      Below offset of coordinates and numbers of tiles in each direction
      is used to narrow loop across array of all tiles when drawing them on screen.
      Without it all tiles would be drawn wheter their are visible or not.
      tilesOutsideCanvas's elements are used as offset when drawing tiles.

      Offset value must be corrected by players movment, to maintain it's accuracy.
      First two sets measures offset of left top and bottom right corner in pixels.
      Third set gives top, right, bottom and left offset in number of tiles outside canvas.
  */

  // offset determines camera position, default position is left top
  this.offsetTopLeft = {
    x: 0,
    y: 0
  };
  this.offsetBottomRight = {
    x: that.mapWidth - canvasWidth,
    y: that.mapHeight - canvasHeight
  };
  this.tilesOutsideCanvas = {
    top:    Math.floor(this.offsetTopLeft.y / this.tileHeight),
    right:  Math.floor(this.offsetBottomRight.x / this.tileWidth),
    bottom: Math.floor(this.offsetBottomRight.y / this.tileHeight),
    left:   Math.floor(this.offsetTopLeft.x / this.tileWidth)
  };
  this.selectedTile = [];
  this.tragicEnding = false;
  this.renderSwitch = true;

  // Tiles on 0 level generaotr - layer 0

  // fill the above array with data on each tile
  this.createLayer();
  // map corners
  this.c = {
    // top
    t: {
      // left
      l: that.tiles[0][0],
      // right
      r: that.tiles[0][this.tiles.length - 1]
    },
    // bottom
    b: {
      // left
      l: that.tiles[that.tiles.length - 1][0],
      // right
      r: that.tiles[that.tiles.length - 1][that.tiles[0].length - 1]
    }
  };
  this.calculateTilesBase();

  this.strokeAllTilesBase = function( ctx, color ) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    let i = 4;

    for(r = that.tilesOutsideCanvas.top + 1; r < that.tiles.length - that.tilesOutsideCanvas.bottom - 1; r++) {
      for(c = that.tilesOutsideCanvas.left + 1; c < that.tiles[r].length - that.tilesOutsideCanvas.right - 1; c++) {
         that.tiles[r][c].base.strokeWithoutOptions( ctx, i );
      }
    }

    ctx.restore();
  };

  this.fillOneTileBase = function( context, color, r, c ) {
    var t = that.tiles[r][c];
    t.base.fill(context, color, t.z);
  };


  this.randomTile = function(){
    let c = Math.floor( (Math.random() * that.yTilesNumber) );
    let r = Math.floor( (Math.random() * that.xTilesNumber) );
    return that.tiles[c][r]
  };
  // this.randomizeTerrain();
  // this.fallFromLeft();
  // this.fallFromTop();
  // this.makeHoles();
  // this.makeBumps();

  // this.makeHighBump();
  // this.makeWall();

  // test falling
  // this.moveOneTile(41, 21, 40);
  // this.moveOneTile(39, 18, 10);
  // this.moveOneTile(37, 20, 20);
  // this.moveOneTile(37, 17, -10);
  // this.moveOneTile(35, 19, -20);

  // this.startInHell();

  // this.whites();

  // this.cave();
  this.river( 1, 1, 1, this.c.t.l, this.c.b.r );
  // this.river(
  //   this.tiles[0][0],
  //   this.tiles[ this.tiles.length - 1 ][ this.tiles[0].length - 1 ],
  //   550,
  //   1
  // );

  this.findMaxAndMinZ();
};



// Generators - are deployed before the game start to calculate map shape
//----------------------------------------

generateMap.prototype.river = function( riverWidth, xBezier, yBezier, start, end ) {
  var that = this;

  var river = that.tilesOnBezierCurve( riverWidth, xBezier, yBezier, start, end );

  for ( i = 0; i < river.length; i++ ) {
    if ( river[i] ) {
      river[i].z = 10;
      river[i].type = lava;
    }
  }
}

// random tile on random edge
generateMap.prototype.randomTileOnRandomEdge = function() {
  var that = this;

  // 0 - top, 1 - right, 2 - bottom, 3 - left
  var draw = random(4),
      s, // starting tile
      rn = that.yTilesNumber,  // number of rows
      cn = that.xTilesNumber,  // number of columns

      rr = random(rn),  // random row
      cr = random(cn),  // random column
      t = that.tiles;   // reference for tile array

  switch ( draw ) {
    case 0: s = t[0][cr];       break;
    case 1: s = t[rr][cn - 1];  break;
    case 2: s = t[rn - 1][cr];  break;
    case 3: s = t[rr][0];       break;
  }
  return s;
}
/*
  This function returns array of tiles that lay on the calculated
  line of bezier curve.
  start - tile from witch curve will start
  end - tile where curve will end
  xBezier - defines first mod for bezier curve
  yBezier - as above but second
  riverWidth - rWidth - to define how wide river will be in number of tiles,
               from line made out of single tiles to specyfied width in tiles

  How it works?
    1. Draw starting tile on one of the edges
    2. Draw ending tile on one of the edges, but not the same as starting tile
    3. Draw additional point on the map where river will turn, multiple point possible
    4. Change type of all of the tiles on the way from start, through turn points to the end

*/
generateMap.prototype.tilesOnBezierCurve = function( riverWidth, xBezier, yBezier, start, end ) {
  // starting tile
  var st = !start ? this.randomTileOnRandomEdge() : start; // random tile on random edge
  // m.ltp( st, "start" );

  // ending tile
  if ( end ) {
    et = end;

  } else {
    // if tiles are on the same edge draw ending tile again
    do {
      et = this.randomTileOnRandomEdge();
    }
    while ( et.r == st.r || et.c === st.c );    
  }
  // m.ltp( et, "end" );

  var m = this,
      xB = xBezier  || 1, // the amoount of the bezier curvature, if false line will be straigth
      yB = yBezier  || 1,
      xLast, yLast, rLast, cLast, rTemp, cTemp,
      bezierPoly, col, re, // colision variables
      tt, lt, // temporary tile and last tile
      river = [], // array of tiles creating river that will be returned at the end
      w = riverWidth || 1, // river width, describes radius mesured in tiles from center tile
      w1, w2, w3, w4;

  // create poly to colide with tiles on its way from start to end
  bezierPoly = new P(new V(-1, -1), [
    new V(1, 1),
    new V(1, 1),
    new V(1, 1),
    new V(1, 1)
  ]);

  for( i = 0; i <= 1; i += 0.001 )
  {
    x = Math.round( (1 - i) * (1 - i) * st.xAbsolute + 2 * (1-i) * i * xB + i * i * et.xAbsolute );
    y = Math.round( (1 - i) * (1 - i) * st.yAbsolute + 2 * (1-i) * i * yB + i * i * et.yAbsolute );
    
    rTemp = Math.round( y / m.tileHeightHalf );
    cTemp = Math.round( x / m.tileWidth );

    bezierPoly.pos.x = x;
    bezierPoly.pos.y = y;      
    
    // loop over narrow area around tile and test collisions
    for( r = rTemp - w; r < rTemp + w; r++ ) {
      if( r >= 0 && r < m.tiles.length ) {
        for( c = cTemp - w; c < cTemp + w; c++ ) {
          if( c >= 0 && c < m.tiles[r].length ) {
            var t = m.tiles[r][c];

            // set up the collision
            re = new SAT.Response();
            re.clear();          
            col = bezierPoly.collidesWith(t.base, re); // test collision

            if ( col ) { // if collision is true
              // diferate betwean even and odd width 
              if ( w % 2 === 0 ) {
                w1 = w - 2;
                w4 = 1;
              }
              else {
                w1 = w -1;
                w4 = 0;
              }
              
              // half of the width that will be equally redistributed on both sides
              // should not be less than zero
              w2 = Math.floor(w1 * 0.5);
              w3 = w2 < 0 ? 0 : w2;

              // loope over range of tiles starting from the tile that colided with the point
              // on the bezier line end expand if width is bigger than zero
              for( a = t.r - w3; a < t.r + 1 + w3; a++ ) {
                if( a >= 0 && a < m.tiles.length ) {
                  for( b = t.c; b < t.c + 1 + w3 + w4; b++ ) {
                    if( b >= 0 && b < m.tiles[r].length ) {
                      river.push( m.tiles[a][b] )
                      var ab = m.tiles[a][b];
                      l(ab.r + " " + ab.c);
                    }
                  }
                }
              }
            }
            else {
              // t.type = cobblestone;
              // t.z = -8;
            }
            // river.push( t );
          }  
        }
      }
    }
  }
  return river;
}

generateMap.prototype.cave = function() {
  this.tragicEnding = true;
  var that = this;
  // turn all tiles to black dirt
  for(r = 0; r < that.tiles.length; r++) {
    for(c = 0; c < that.tiles[r].length; c++) {
        that.tiles[r][c].type = dirtblacklong;
    }
  }
  // create stone stage in center of the map
  var rn = this.tiles.length / 2;
  var cn = this.tiles[rn].length / 2;

  for(r = -6; r < 6; r++) {
    for(c = -3; c < 3; c++) {

      var t = that.tiles[rn + r][cn + c];

      t.type = cobblestone;
      t.z = 90;
    }
  }
}

generateMap.prototype.startInHell = function() {
  this.tragicEnding = true;
  var that = this;
  // all tiles into cobblestone
  for(r = 0; r < that.tiles.length; r++) {
    for(c = 0; c < that.tiles[r].length; c++) {
        that.tiles[r][c].type = cobblestone;
    }
  }
  // create stone stage in center of the map
  var rn = this.tiles.length / 2;
  var cn = this.tiles[rn].length / 2;
  for(r = -7; r < 7; r++) {
    for(c = -5; c < 5; c++) {
      this.tiles[rn + r][cn + c].z = -((Math.floor( (Math.random() * 10) )) + 5);
    }
  }
  for(r = -3; r < 3; r++) {
    for(c = -3; c < 3; c++) {
      this.tiles[rn + r][cn + c].z = -30;
    }
  }
  for(r = -2; r < 2; r++) {
    for(c = -2; c < 2; c++) {
      this.tiles[rn + r][cn + c].z = -50;
    }
  }
  // randomly pull up tiles and turn them to stone
  if(typeof this.randomTile !== undefined) {
      for(i = 0; i < 4500; i++) {
        let rnd = that.randomTile();
        rnd.z -= Math.floor( (Math.random() * 15) );
        rnd.type = cobblestone//that.randomType();
      }
  }
  // turn all tiles that have z = 0 to lava
  for(r = 0; r < that.tiles.length; r++) {
    for(c = 0; c < that.tiles[r].length; c++) {
       if ( that.tiles[r][c].z >= 0 ) {
        that.tiles[r][c].type = lava;
       }
    }
  }
}

generateMap.prototype.whites = function() {
  this.tragicEnding = true;
  var that = this;
  // all tiles into cobblestone
  for(r = 0; r < that.tiles.length; r++) {
    for(c = 0; c < that.tiles[r].length; c++) {
        that.tiles[r][c].type = white;
    }
  }
  // create stone stage in center of the map
  var rn = this.tiles.length / 2;
  var cn = this.tiles[rn].length /2;
  for(r = -5; r < 5; r++) {
    for(c = -4; c < 4; c++) {
      this.tiles[rn + r][cn + c].z = -((Math.floor( (Math.random() * 10) )) + 5);
    }
  }
  for(r = -3; r < 3; r++) {
    for(c = -3; c < 3; c++) {
      this.tiles[rn + r][cn + c].z = -30;
    }
  }
  for(r = -2; r < 2; r++) {
    for(c = -2; c < 2; c++) {
      this.tiles[rn + r][cn + c].z = -50;
    }
  }
  // randomly pull up tiles and turn them to stone
  if(typeof this.randomTile !== undefined) {
      for(i = 0; i < 1000; i++) {
        let rnd = that.randomTile();
        rnd.z -= Math.floor( (Math.random() * 15) );
      }
  }
}

generateMap.prototype.randomType = function() {
  let that = this;
  let sprite = Math.floor((Math.random() * 3) + 1);

  switch( sprite ) {
    case 1:
      return grass;
      break;
    case 2:
      return dirt;
      break;
    case 3:
      return mud;
    }
}

// this makes sure natural ground is never even
generateMap.prototype.randomizeTerrain = function() {
  let that = this;
  for(r = 0; r < that.tiles.length; r++) {
    for(c = 0; c < that.tiles[r].length; c++) {
      let rndLevel = Math.floor( (Math.random() * 5) );
      let rndSign = Math.random() < 0.5 ? -1 : 1;
      that.tiles[r][c].z += rndSign > 0 ? rndLevel : -rndLevel;
    }
  }
};
generateMap.prototype.fallFromLeft = function() {
  let that = this;
  let z = 0;
  for(r = 0; r < that.tiles.length; r++) {
    for(c = 0; c < that.tiles[r].length; c++) {
      that.tiles[r][c].z += z;
      z += 4;
    }
    z = 0;
  }
};
generateMap.prototype.fallFromTop = function() {
  let that = this;
  let z = 0;
  for(r = 0; r < that.tiles.length; r++) {
    for(c = ( that.tiles[r].length / 2 ) + 5; c < that.tiles[r].length; c++) {
      that.tiles[r][c].z += z;
    }
    z += 3;
  }
};
generateMap.prototype.makeHoles = function(){
  let that = this;
  if(typeof this.randomTile !== undefined) {
    for(i = 0; i < 1000; i++) {
      let rnd = that.randomTile();
      rnd.z += 20;
    }
  }
};
generateMap.prototype.makeBumps = function() {
  let that = this;
  if(typeof this.randomTile !== undefined) {
      for(i = 0; i < 1000; i++) {
        let rnd = that.randomTile();
        rnd.z -= Math.floor( (Math.random() * 15) );
      }
  }
};
generateMap.prototype.flatAllTiles = function() {
  let that = this;

  for(r = 0; r < that.tiles.length; r++) {
    for(c = 0; c < that.tiles[r].length; c++) {
       that.tiles[r][c].z = 0;
    }
  }
}


generateMap.prototype.moveOneTile = function(r, c, value) {
  let that = this;
  that.tiles[r][c].z += value;
};


generateMap.prototype.makeHighBump = function() {
  let that = this;
  if(typeof this.randomTile !== undefined) {
      for(i = 0; i < 100; i++) {
        let rnd = that.randomTile();
        rnd.z -= 67;
      };
    }
};
generateMap.prototype.makeWall = function() {
  let that = this;
    let r = Math.floor((Math.random() * that.yTilesNumber));
    let c = Math.floor((Math.random() * that.xTilesNumber));
    // wlal length
    let l = Math.floor((Math.random() * 30));

    // Direction: 0 face bottom, 1 left bottom, 2 left, 3 left top, 4 top, 5 right top, 6 right, 7 right bottom
    let d = Math.floor((Math.random() * 8));

    switch(d){
      case 0:
        for(i = 0; i < l; i++) {
          if( r !== undefined && c !== undefined ) {
            that.tiles[r - 1][c + i].z -= 64;
            r -= 1;
          }

        };
        break;
      case 1:
        // code
        break;
      case 2:
        // code
        break;
      case 3:
        // code
        break;
      case 4:
        // code
        break;
      case 5:
        // code
        break;  
      case 6:
        // code
        break;
      case 7:
        // code
    }
  };

// writeTilesBase creates for each tile vector base which will be used
// to calculate collision with player and other characters
generateMap.prototype.calculateTilesBase = function(){
  let that = this,
      n = -1,
      t;

  for (r = 0; r < that.yTilesNumber; r++) {
    for(c = 0; c < that.xTilesNumber; c++) {

      t = that.tiles[r][c];
      // l(t.r + " " + t.c);
      // l(t.x + " " + t.y);
      // l(x + " " + y);

      t.base = new P( new V(t.x, t.y ), [
          new V( that.tileWidthHalf + n, n ),
          new V( that.tileWidth + n, that.tileHeightHalf + n ),
          new V( that.tileWidthHalf + n, that.tileHeight + n ),
          new V( n, that.tileHeightHalf + n )
      ]);
      // l(t.r + " " + t.c + " bx: " + t.base.pos.x + " by: " + t.base.pos.y);
    };
  };
};

generateMap.prototype.updateTilesOutside = function() {
  let that = this;
  that.tilesOutsideCanvas.top = Math.floor(Math.abs(that.offsetTopLeft.y) / that.tileHeightHalf);
  that.tilesOutsideCanvas.right = Math.floor(that.offsetBottomRight.x / that.tileWidth);
  that.tilesOutsideCanvas.bottom = Math.floor(that.offsetBottomRight.y / that.tileHeightHalf);
  that.tilesOutsideCanvas.left = Math.floor(Math.abs(that.offsetTopLeft.x) / that.tileWidth);
};

// start position calculates offset for starting camera position and appends it to all tiles position
generateMap.prototype.startPositionSwitch = function(startPosition_x, startPosition_y, playerObject) {
  let that = this;
  let p = playerObject;

  // default: left, top
  if(startPosition_x === "left" &&
    startPosition_y === "top" ||
    startPosition_x === undefined ||
    startPosition_y === undefined) {
    // write it
  };

  //  center, center
  if(startPosition_x === "center" && startPosition_y === "center"){
    let tileInCenter = that.tiles[ Math.floor( that.yTilesNumber * 0.5 ) - 4 ][ Math.floor( that.xTilesNumber * 0.5 ) ];

    p.startPosition(
      that.mapWidthHalf,
      that.mapHeightHalf,
      tileInCenter.z - 50
    );

  };


  that.updateTilesOutside();

  // after calculating offsets this will apend thier values to all tiles
  ctx1.translate(that.offsetTopLeft.x, that.offsetTopLeft.y);
  // ctx2.translate(that.offsetTopLeft.x, that.offsetTopLeft.y);
  // ctx3.translate(that.offsetTopLeft.x, that.offsetTopLeft.y);
};

generateMap.prototype.findMaxAndMinZ = function () {
  let that = this;
  let max = 0;
  let min = 0;

  for (r = 0; r < that.yTilesNumber; r++) {
    for(c = 0; c < that.xTilesNumber; c++) {
      max = that.tiles[r][c].z < max ? that.tiles[r][c].z : max;
      min = that.tiles[r][c].z > min ? that.tiles[r][c].z : min;
    }
  }
  that.zMax = max;
  that.zMin = min;
};

generateMap.prototype.cameraUpdate = function ( m, x, y, z ) {
  // m = mapObject;

  // this function allows camera (canvas) to follow x, y, z coordinates, for example - the player character 

  // update top left x offset
  if( -(x - canvasWidthHalf) < -(m.clipByTiles * m.tileWidth) &&
      -(x - canvasWidthHalf) > -(m.mapWidth - canvasWidth) + (m.clipByTiles * m.tileWidth)) {

    m.offsetTopLeft.x =  -(x - canvasWidthHalf);
  }

  // update top left y offset
  if( -(y - canvasHeightHalf) < -(m.clipByTiles * m.tileWidth) /*- m.zMax*/ &&
      -(y - canvasHeightHalf) > -(m.mapHeight - canvasHeight) + (m.clipByTiles * m.tileWidth) /*- m.zMin*/  ) {

      m.offsetTopLeft.y = -(y /*+ z*/ - canvasHeightHalf);
  }

  // update bottom right x offset
  if( m.mapWidth - x - canvasWidthHalf > m.clipByTiles * m.tileWidth &&
      m.mapWidth - x - canvasWidthHalf < m.mapWidth - canvasWidth - (m.clipByTiles * m.tileWidth)) {

      m.offsetBottomRight.x = m.mapWidth - x - canvasWidthHalf;
  }

  // update bottom right y offset
  if( m.mapHeight - y - canvasHeightHalf > m.clipByTiles * m.tileWidth /*+ m.zMax*/  &&
      m.mapHeight - y - canvasHeightHalf < m.mapHeight - canvasHeight - (m.clipByTiles * m.tileWidth) /*+ m.zMin*/ ) {

      m.offsetBottomRight.y = m.mapHeight - y /*+ z*/ - canvasHeightHalf;
  }

  m.updateTilesOutside();
};
// log tile position: r, c
generateMap.prototype.ltp = function( t, message ) {
  var m = message || "";
  l(m + "r: " + t.r + " " + " c: " + t.c)
}