var checkedValue;
var devToolsSet = [
  ["Player",  { update: function () { return "" }}],
  ["x: ",  { update: function () { return player.x }}],
  ["y: ",  { update: function () { return player.y }}],
  ["z: ",  { update: function () { return player.z }}],
  ["Player object speed: ",  { update: function () { return player.speed }}],
  ["player.xV: ",  { update: function () { return player.xV }}],
  ["player.yV: ",  { update: function () { return player.yV }}],
  ["player.zV: ",  { update: function () { return player.zV }}],
  ["player.spriteSheet.direction: ",  { update: function () { return player.spriteSheet.direction }}],
  ["player.lastTileStoodOn: ",  { update: function () {
    return Math.floor( player.lastTileStoodOn.yAbsolute / map.tileHeightHalf ) + ", " +
           Math.floor( player.lastTileStoodOn.xAbsolute / map.tileWidth )
  }}],
  ["player.lastTileStoodOn.z: ",  { update: function () { return player.lastTileStoodOn.z }}],
  ["player.isInTheAir: ",  { update: function () { return player.isInTheAir }}],

  ["Player collision: ",  { update: function () { return player.collisionDetected }}],

  ["Player collision model area",  { update: function () { return "" }}],
  ["left: ",  { update: function () { return player.collisionModel.area.left }}],
  ["top: ",  { update: function () { return player.collisionModel.area.top }}],
  ["right: ",  { update: function () { return player.collisionModel.area.right }}],
  ["bottom: ",  { update: function () { return player.collisionModel.area.bottom }}],

  ["Player collision model points",  { update: function () { return "" }}],
  ["topLeft.x: ",  { update: function () { return player.collisionModel.area.points.topLeft.x }}],
  ["topLeft.y: ",  { update: function () { return player.collisionModel.area.points.topLeft.y }}],
  ["bottomRight.x: ",  { update: function () { return player.collisionModel.area.points.bottomRight.x }}],
  ["bottomRight.y: ",  { update: function () { return player.collisionModel.area.points.bottomRight.y }}],

  ["Map",  { update: function () { return "" }}],
  ["Map width: ",  { update: function () { return map.mapWidth }}],
  ["Map height: ",  { update: function () { return map.mapHeight }}],
  ["Tiles horizontaly: ",  { update: function () { return map.xTilesNumber }}],
  ["Tiles verticaly: ",  { update: function () { return map.yTilesNumber }}],
  ["Total number of tiles: ",  { update: function () { return (map.xTilesNumber * map.yTilesNumber) }}],
  ["Tile width: ",  { update: function () { return map.tileWidth }}],
  ["Tile height: ",  { update: function () { return map.tileHeight }}],
  ["Selected tile: ",  { update: function () { return map.selectedTile }}],

  ["Map offset in px",  { update: function () { return "" }}],
  ["Left top offset x: ",  { update: function () { return map.offsetTopLeft.x }}],
  ["Left top offset y: ",  { update: function () { return map.offsetTopLeft.y }}],
  ["Right bottom offset x: ",  { update: function () { return map.offsetBottomRight.x }}],
  ["Right bottom offset y: ",  { update: function () { return map.offsetBottomRight.y }}],

  ["Map offset in tiles",  { update: function () { return "" }}],
  ["Tiles outside canvas left: ",  { update: function () { return map.tilesOutsideCanvas.left }}],
  ["Tiles outside canvas right: ",  { update: function () { return map.tilesOutsideCanvas.right }}],
  ["Tiles outside canvas top: ",  { update: function () { return map.tilesOutsideCanvas.top }}],
  ["Tiles outside canvas bottom: ",  { update: function () { return map.tilesOutsideCanvas.bottom }}],

  ["Mouse",  { update: function () { return "" }}],
  ["xMouse: ",  { update: function () { return mouse.x }}],
  ["yMouse: ",  { update: function () { return mouse.y }}],
  ["Mouse poly x: ",  { update: function () { return mousePoly.pos.x }}],
  ["Mouse poly y: ",  { update: function () { return mousePoly.pos.y }}],
  ["Is mouse down?: ",  { update: function () { return mouse.isDown }}],

  ["Camera - canvas",  { update: function () { return "" }}],
  ["Canvas width: ",  { update: function () { return canvasWidth }}],
  ["Canvas height: ",  { update: function () { return canvasHeight }}]
]

function insertUL() {
	var ul = document.querySelector("#devTools > div > ul"), li;
	var tmp;
	for( i = 0; i < devToolsSet.length; i++ ) {

		li = document.createElement("li");

		tmp = devToolsSet[i][1].update();

		if( tmp === "" ) {
			li.className = "header";
		};

		li.innerHTML = devToolsSet[i][0] + "<span></span>";
		ul.appendChild(li);

		devToolsSet[i].push(li);
		devToolsSet[i].push(li.getElementsByTagName("span")[0]);
	}
};
insertUL();

function updateDevToolsInfo() {
	for( i = 0; i < devToolsSet.length; i++ ) {
		devToolsSet[i][3].innerHTML = devToolsSet[i][1].update();
	}	
}