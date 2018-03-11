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




var selectTilesSwitch = false;

function selectTilesSwitcher(){
  selectTilesSwitch = selectTilesSwitch === true ? false : true;
}
function fillSelectedTile(ctx){
  var r = Math.floor((yMouse + Math.abs(map.offsetTopLeft.y)) / map.tileHeightHalf);
  var c = Math.floor((xMouse + Math.abs(map.offsetTopLeft.x)) / map.tileWidth);

  map.fillOneTileBase( ctx, "rgba(0, 110, 255, 0.3)", r, c );
  map.tiles[r][c].base.stroke( ctx, "rgb(0, 0, 255)" );
}


var devToolsSwitch = true;

function devToolsSwitcher(){
  devToolsSwitch = devToolsSwitch === true ? false : true;
}

function devTools(ctx){
  
  // map.strokeAllTilesBase(ctx, "rgba(0, 0, 255, 0.2)"); 
  // player.collisionModel.drawArea(map, player, ctx)
  // player.pinPoint(ctx, map, "#0000ff");
  // drawCanvasCenter("#ff0000", ctx);
  // playerBase(ctx, "rgba(255, 0, 0, 0.4)");
  // player.collisionModel.base.point.fill(ctx, "rgb(255, 0, 0)");
  // map.fillOneTileBase(ctx, "rgba(255, 0, 0, 0.3)", player.standsOnTile[0], player.standsOnTile[1]);


  customMessage(ctx, "x: " + player.x, player.x, player.y, 40, -100, 20);
  customMessage(ctx, "y: " + player.y, player.x, player.y, 40, -75, 20);
  customMessage(ctx, "z: " + player.z, player.x, player.y, 40, -50, 20);

  // ctx.setTransform(1, 0, 0, 1, 0, 0);
  // customMessage(ctx, "Left top offset x: " + map.offsetTopLeft.x + " px", 10, 20, 0, 0, 20, false);
  // customMessage(ctx, "Left top offset y: " + map.offsetTopLeft.y + " px", 10, 40, 0, 0, 20, false);
  // customMessage(ctx, "Right bottom offset x: " + map.offsetBottomRight.x + " px", 10, 60, 0, 0, 20, false);
  // customMessage(ctx, "Right bottom offset y: " + map.offsetBottomRight.y + " px", 10, 80, 0, 0, 20, false);

  // customMessage(ctx, "Tiles outside canvas left: " + map.tilesOutsideCanvas.left, 10, 120, 0, 0, 20, false);
  // customMessage(ctx, "Tiles outside canvas right: " + map.tilesOutsideCanvas.right, 10, 140, 0, 0, 20, false);
  // customMessage(ctx, "Tiles outside canvas top: " + map.tilesOutsideCanvas.top, 10, 160, 0, 0, 20, false);
  // customMessage(ctx, "Tiles outside canvas bottom: " + map.tilesOutsideCanvas.bottom, 10, 180, 0, 0, 20, false);

  // customMessage(ctx, "Canvas width: " + canvasWidth, 10, 220, 0, 0, 20, false);
  // customMessage(ctx, "Canvas height: " + canvasHeight, 10, 240, 0, 0, 20, false);
  // customMessage(ctx, "Map width: " + map.mapWidth, 10, 260, 0, 0, 20, false);
  // customMessage(ctx, "Map height: " + map.mapHeight, 10, 280, 0, 0, 20, false);
  // customMessage(ctx, "Tiles horizontaly: " + map.xTilesNumber, 10, 300, 0, 0, 20, false);
  // customMessage(ctx, "Tiles verticaly: " + map.yTilesNumber, 10, 320, 0, 0, 20, false);
  // customMessage(ctx, "Tile width: " + map.tileWidth, 10, 340, 0, 0, 20, false);
  // customMessage(ctx, "Tile height: " + map.tileHeight, 10, 360, 0, 0, 20, false);

  // customMessage(ctx, "Player object speed: " + player.speed, 10, 400, 0, 0, 20, false);
  // customMessage(ctx, "player.xVelocity: " + player.xVelocity, 10, 420, 0, 0, 20, false);
  // customMessage(ctx, "player.yVelocity: " + player.yVelocity, 10, 440, 0, 0, 20, false);
  // customMessage(ctx, "player.x: " + player.x, 10, 460, 0, 0, 20, false);
  // customMessage(ctx, "player.y: " + player.y, 10, 480, 0, 0, 20, false);

  // customMessage(ctx, "Total number of tiles: " + (map.xTilesNumber * map.yTilesNumber), 10, 520, 0, 0, 20, false);

  // customMessage(ctx, "Player collision: " + player.collisionDetected, 10, 540, 0, 0, 20, false);

  // customMessage(ctx, "player.collisionModel.area.left: " + player.collisionModel.area.left, 10, 580, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area.top: " + player.collisionModel.area.top, 10, 600, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area.right: " + player.collisionModel.area.right, 10, 620, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area..bottom: " + player.collisionModel.area.bottom, 10, 640, 0, 0, 20, false);

  // customMessage(ctx, "player.collisionModel.area.points.topLeft.x: " + player.collisionModel.area.points.topLeft.x, 10, 680, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area.points.topLeft.y: " + player.collisionModel.area.points.topLeft.y, 10, 700, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area.points.bottomRight.x: " + player.collisionModel.area.points.bottomRight.x, 10, 720, 0, 0, 20, false);
  // customMessage(ctx, "player.collisionModel.area.points.bottomRight.y: " + player.collisionModel.area.points.bottomRight.y, 10, 740, 0, 0, 20, false);

  // customMessage(ctx, "player.spriteSheet.direction: " + player.spriteSheet.direction, 10, 780, 0, 0, 20, false);
};