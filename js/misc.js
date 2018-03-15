// Custom message constructor
function customMessage(ctx, message, x, y, xOffset, yOffset, fontSize, resetCanvasTransform) {
	if(resetCanvasTransform) {ctx.setTransform(1, 0, 0, 1, 0, 0);}

  ctx.font = fontSize + "px Bold Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText(message, x + xOffset, y + yOffset);
};

function drawCanvasCenter(color, ctx) {
	ctx.save()
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	ctx.strokeStyle = color;
	ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(canvasWidthHalf, 0);
  ctx.lineTo(canvasWidthHalf, canvasHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, canvasHeightHalf);
  ctx.lineTo(canvasWidth, canvasHeightHalf);
  ctx.stroke();

  ctx.restore();
};

function playerBase(ctx, color) {
  player.collisionModel.base.poly.fill(ctx, color);
};




let selectTilesSwitch = false;

function selectTilesSwitcher(){
  selectTilesSwitch = selectTilesSwitch === true ? false : true;
}

function fillSelectedTile( ctx, mapObject ) {
  let m = mapObject;
  
  let rP = Math.floor( ( mouse.y + Math.abs( m.offsetTopLeft.y) ) / m.tileHeightHalf );
  let cP = Math.floor( ( mouse.x + Math.abs( m.offsetTopLeft.x) ) / m.tileWidth );

  let col;

  for( r = rP - 2; r < rP + 2; r++ ) {
    if( r >= 0 && r < m.tiles.length ) {

      for( c = cP - 1; c < cP + 1; c++ ) {
        if( c >= 0 && c < m.tiles[r].length ) {

          let re = new SAT.Response();
          re.clear();          

          col = mousePoly.collidesWith(m.tiles[r][c].base, re);

          if( col ) {
            map.tiles[r][c].base.fill( ctx, "rgba(0, 110, 255, 0.3)" );
            map.tiles[r][c].base.stroke( ctx, "rgb(0, 0, 255)" );

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            customMessage( ctx, "r: " + r, mouse.x, mouse.y, 40, -10, 20 );
            customMessage( ctx, "c: " + c, mouse.x, mouse.y, 40, 10, 20 );
            ctx1.translate(m.offsetTopLeft.x, m.offsetTopLeft.y);

            if( !mouse.isDown ) { m.selectedTile = m.tiles[r][c]; };
          }
        }  
      }
    }
  }
}


let devToolsSwitch = false;

function devToolsSwitcher(){
  devToolsSwitch = devToolsSwitch === true ? false : true;
}

function devTools( ctx ){
  
  map.strokeAllTilesBase(ctx, "rgba(0, 0, 255, 0.2)"); 
  player.collisionModel.drawArea(map, player, ctx)
  player.pinPoint(ctx, map, "#0000ff");
  drawCanvasCenter("#ff0000", ctx);
  playerBase(ctx, "rgba(255, 0, 0, 0.4)");
  player.collisionModel.base.point.fill(ctx, "rgb(255, 0, 0)");
  updateDevToolsInfo()

  // customMessage( ctx, "x: " + player.x, player.x, player.y, 40, player.z - 100, 20 );
  // customMessage( ctx, "y: " + player.y, player.x, player.y, 40, player.z - 75, 20 );
  // customMessage( ctx, "z: " + player.z, player.x, player.y, 40, player.z - 50, 20 );

  // ctx.setTransform(1, 0, 0, 1, 0, 0);
  // customMessage( ctx, "Left top offset x: " + map.offsetTopLeft.x + " px", 10, 20, 0, 0, 20, false );
  // customMessage( ctx, "Left top offset y: " + map.offsetTopLeft.y + " px", 10, 40, 0, 0, 20, false );
  // customMessage( ctx, "Right bottom offset x: " + map.offsetBottomRight.x + " px", 10, 60, 0, 0, 20, false );
  // customMessage( ctx, "Right bottom offset y: " + map.offsetBottomRight.y + " px", 10, 80, 0, 0, 20, false );

  // customMessage(ctx, "xMouse: " + xMouse, 10, 120, 0, 0, 20, false);
  // customMessage(ctx, "yMouse: " + yMouse, 10, 140, 0, 0, 20, false);
  // customMessage(ctx, "Mouse poly x: " + mousePoly.pos.x, 10, 160, 0, 0, 20, false);
  // customMessage(ctx, "Mouse poly y: " + mousePoly.pos.y, 10, 180, 0, 0, 20, false);

  // customMessage(ctx, "Tiles outside canvas left: " + map.tilesOutsideCanvas.left, 10, 220, 0, 0, 20, false);
  // customMessage(ctx, "Tiles outside canvas right: " + map.tilesOutsideCanvas.right, 10, 240, 0, 0, 20, false);
  // customMessage(ctx, "Tiles outside canvas top: " + map.tilesOutsideCanvas.top, 10, 260, 0, 0, 20, false);
  // customMessage(ctx, "Tiles outside canvas bottom: " + map.tilesOutsideCanvas.bottom, 10, 280, 0, 0, 20, false);

  // customMessage(ctx, "Canvas width: " + canvasWidth, 10, 320, 0, 0, 20, false);
  // customMessage(ctx, "Canvas height: " + canvasHeight, 10, 340, 0, 0, 20, false);
  // customMessage(ctx, "Map width: " + map.mapWidth, 10, 360, 0, 0, 20, false);
  // customMessage(ctx, "Map height: " + map.mapHeight, 10, 380, 0, 0, 20, false);
  // customMessage(ctx, "Tiles horizontaly: " + map.xTilesNumber, 10, 400, 0, 0, 20, false);
  // customMessage(ctx, "Tiles verticaly: " + map.yTilesNumber, 10, 420, 0, 0, 20, false);
  // customMessage(ctx, "Tile width: " + map.tileWidth, 10, 440, 0, 0, 20, false);
  // customMessage(ctx, "Tile height: " + map.tileHeight, 10, 460, 0, 0, 20, false);

  // customMessage(ctx, "Player object speed: " + player.speed, 10, 500, 0, 0, 20, false);
  // customMessage(ctx, "player.xVelocity: " + player.xVelocity, 10, 520, 0, 0, 20, false);
  // customMessage(ctx, "player.yVelocity: " + player.yVelocity, 10, 540, 0, 0, 20, false);
  // customMessage(ctx, "player.x: " + player.x, 10, 560, 0, 0, 20, false);
  // customMessage(ctx, "player.y: " + player.y, 10, 580, 0, 0, 20, false);

  // customMessage(ctx, "Total number of tiles: " + (map.xTilesNumber * map.yTilesNumber), 10, 620, 0, 0, 20, false);

  // customMessage(ctx, "Player collision: " + player.collisionDetected, 10, 640, 0, 0, 20, false);

  // customMessage(ctx, "player.collisionModel.area.left: " + player.collisionModel.area.left, 10, 680, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area.top: " + player.collisionModel.area.top, 10, 700, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area.right: " + player.collisionModel.area.right, 10, 720, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area..bottom: " + player.collisionModel.area.bottom, 10, 740, 0, 0, 20, false);

  // customMessage(ctx, "player.collisionModel.area.points.topLeft.x: " + player.collisionModel.area.points.topLeft.x, 10, 780, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area.points.topLeft.y: " + player.collisionModel.area.points.topLeft.y, 10, 800, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area.points.bottomRight.x: " + player.collisionModel.area.points.bottomRight.x, 10, 820, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area.points.bottomRight.y: " + player.collisionModel.area.points.bottomRight.y, 10, 840, 0, 0, 20, false);

  // customMessage(ctx, "player.spriteSheet.direction: " + player.spriteSheet.direction, 10, 980, 0, 0, 20, false);
};