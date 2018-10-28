player.pos.x -= Math.round(response.overlapV.x);
player.pos.y -= Math.round(response.overlapV.y);
playerObject.x -= Math.round(response.overlapV.x);
playerObject.y -= Math.round(response.overlapV.y);
this.area.points.topLeft.x -= Math.round(response.overlapV.x);
this.area.points.topLeft.y -= Math.round(response.overlapV.y);
this.area.points.bottomRight.x -= Math.round(response.overlapV.x);
this.area.points.bottomRight.y -= Math.round(response.overlapV.y);

//block camera, so it would not move while collision is detected
mapObject.offsetTopLeft.x += Math.round(response.overlapV.x);
mapObject.offsetTopLeft.y += Math.round(response.overlapV.y);
mapObject.offsetBottomRight.x += Math.round(response.overlapV.x);
mapObject.offsetBottomRight.y += Math.round(response.overlapV.y);


if((playerObject.x <= canvasWidthHalf + Math.abs(mapObject.offsetTopLeft.x) + (mapObject.clipByTiles * mapObject.tileWidth) - playerObject.spriteCenter.x
&& playerObject.x >= canvasWidthHalf + (mapObject.clipByTiles * mapObject.tileWidth) - playerObject.spriteCenter.x
&& playerObject.y <= canvasHeightHalf + Math.abs(mapObject.offsetTopLeft.y) + (mapObject.clipByTiles * mapObject.tileHeight) - playerObject.spriteCenter.y
&& playerObject.y >= canvasHeightHalf + (mapObject.clipByTiles * mapObject.tileHeight) - playerObject.spriteCenter.y)) {
  
} else if(mapObject.offsetTopLeft.x < 0 &&
   mapObject.offsetTopLeft.y < 0 &&
   mapObject.offsetBottomRight.x > 0 &&
   mapObject.offsetBottomRight.y > 0) {
    playerObject.collisionDetected = true;      
}


createCharacter.prototype.move = function(playerObject, mapObject) {
  var p = playerObject;
  var m = mapObject;  
  
  // reset velocity build up in the last frame
  p.xVelocity = 0;
  p.yVelocity = 0;

  // Player holding left key
  if (37 in keysDown){
    // move canvas if it's in the range of map
    if(m.offsetTopLeft.x + p.xVelocity < -p.xVelocity - (m.clipByTiles * m.tileWidth)) {

      // move canvas if player is in the center of canvas
      if(p.x <= canvasWidthHalf + Math.abs(m.offsetTopLeft.x) + (m.clipByTiles * m.tileWidth) - p.spriteCenter.x) {
        // Move camera (canvas in relation to map)
        p.xVelocity += p.speed;
        // Tracking offset update
        m.offsetTopLeft.x += p.xVelocity;
        m.offsetBottomRight.x += Math.abs(p.xVelocity);
      }

    } else {
      m.offsetTopLeft.x = m.clipByTiles * m.tileWidth === -0 ? 0 : -(m.clipByTiles * m.tileWidth);
    }

    // Move player if he's in the range of map
    if(p.x > m.clipByTiles * m.tileWidth + p.speed && p.x < m.mapWidth) {
        p.x -= p.speed;

      // Move player's collision box
      p.collisionModel.base.poly.pos.x -= p.speed;

      //Move player's collision area
      p.collisionModel.area.points.topLeft.x -= p.speed;
      p.collisionModel.area.left = Math.floor(p.collisionModel.area.points.topLeft.x / m.tileWidth);
      p.collisionModel.area.points.bottomRight.x -= p.speed;
      p.collisionModel.area.right = Math.floor((m.mapWidth - p.collisionModel.area.points.bottomRight.x) / m.tileWidth);

      //

    };

    m.updatetilesOutside_x(); 
  };
  
  // Player holding key right
  if (39 in keysDown) {
    // move canvas if it's in the range of map
    if(Math.abs(m.offsetTopLeft.x) + canvasWidth + p.xVelocity < m.mapWidth - (m.clipByTiles * m.tileWidth)) {

      // move canvas if player is in the center of canvas
      if(p.x >= canvasWidthHalf + (m.clipByTiles * m.tileWidth) - p.spriteCenter.x) {
        // Move camera (canvas in relation to map)
        p.xVelocity -= p.speed;
        // Tracking offset update
        m.offsetTopLeft.x += p.xVelocity;
        m.offsetBottomRight.x -= Math.abs(p.xVelocity);
        }

      } else {
        m.offsetTopLeft.x = canvasWidth - m.mapWidth + (m.clipByTiles * m.tileWidth) === -0 ? 0 : canvasWidth - m.mapWidth + (m.clipByTiles * m.tileWidth);
      };

      // Move player if he's in the range of map
      if(p.x > 0 && p.x < m.mapWidth - (m.clipByTiles * m.tileWidth) - m.tileWidthHalf) {
        p.x += p.speed;

        // Move player's collision box
        p.collisionModel.base.poly.pos.x += p.speed;

        //Move player's collision area
        p.collisionModel.area.points.topLeft.x += p.speed;
        p.collisionModel.area.left = Math.floor(p.collisionModel.area.points.topLeft.x / m.tileWidth);
        p.collisionModel.area.points.bottomRight.x += p.speed;
        p.collisionModel.area.right = Math.floor((m.mapWidth - p.collisionModel.area.points.bottomRight.x) / m.tileWidth);       

      };

      // Update number of tiles outside canvas
      m.updatetilesOutside_x();
  };
  
  
  // Player holding key up
    if (38 in keysDown) {
      // move canvas if it's in the range of map
      if(m.offsetTopLeft.y + p.yVelocity < -(m.clipByTiles * m.tileHeightHalf)) { 

        // move canvas if player is in the center of canvas
        if(p.y <= canvasHeightHalf + Math.abs(m.offsetTopLeft.y) + (m.clipByTiles * m.tileHeight) - p.spriteCenter.y) {
          p.yVelocity -= p.speed;
          // Tracking offset update
          m.offsetTopLeft.y += Math.abs(p.yVelocity);
          m.offsetBottomRight.y += Math.abs(p.yVelocity);
        }

      } else {
        m.offsetTopLeft.y = m.clipByTiles * m.tileHeightHalf === -0 ? 0 : -(m.clipByTiles * m.tileHeightHalf);
      }

      // Move player if he's in the range of map
      if(p.y > m.clipByTiles * m.tileHeight + p.speed && p.y < m.mapHeight) {
        p.y -= p.speed;

        // Move player's collision box
        p.collisionModel.base.poly.pos.y -= p.speed;

        //Move player's collision area
        p.collisionModel.area.points.topLeft.y -= p.speed;
        p.collisionModel.area.top = Math.floor(p.collisionModel.area.points.topLeft.y / m.tileHeight);
        p.collisionModel.area.points.bottomRight.y -= p.speed;
        p.collisionModel.area.bottom = Math.floor((m.mapHeight - p.collisionModel.area.points.bottomRight.y) / m.tileHeight);
      };
      
      m.updatetilesOutside_y();
    };
  
  
  // Player holding key down
  if (40 in keysDown) {
    // move canvas if it's in the range of map
    if(Math.abs(m.offsetTopLeft.y) + canvasHeight + p.yVelocity < m.mapHeight - (m.clipByTiles * m.tileHeightHalf)) {

      // move canvas if player is in the center of canvas
      if(p.y >= canvasHeightHalf + (m.clipByTiles * m.tileHeight) - p.spriteCenter.y) {
        p.yVelocity += p.speed;
        // Tracking offset update
        m.offsetTopLeft.y -= Math.abs(p.yVelocity);
        m.offsetBottomRight.y -= Math.abs(p.yVelocity);
      }

    } else {
      m.offsetBottomRight.y = m.clipByTiles * m.tileHeightHalf  === -0 ? 0 : m.clipByTiles * m.tileHeightHalf;
    }

    // Move player if he's in the range of map
    if(p.y > 0 && p.y < m.mapHeight - (m.clipByTiles * m.tileHeight) - m.tileWidthHalf) {
      p.y += p.speed;

      // Move player's collision box
      p.collisionModel.base.poly.pos.y += p.speed;

      //Move player's collision area
      p.collisionModel.area.points.topLeft.y += p.speed;
      p.collisionModel.area.top = Math.floor(p.collisionModel.area.points.topLeft.y / m.tileHeight);
      p.collisionModel.area.points.bottomRight.y += p.speed;
      p.collisionModel.area.bottom = Math.floor((m.mapHeight - p.collisionModel.area.points.bottomRight.y) / m.tileHeight);
    };
    m.updatetilesOutside_y();
  }
}