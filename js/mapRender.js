// render function displays tiles images and updates their position with player velocity
generateMap.prototype.render = function(playerObject){
  let m = this, // map
      p = playerObject,
      o = m.offsetTopLeft.y > 0 ? 0 : -m.offsetTopLeft.y,
      img;
  // let ctx = ctx1;
  
  ctx1.setTransform(1, 0, 0, 1, 0, 0);
  ctx1.translate(m.offsetTopLeft.x, m.offsetTopLeft.y);

  // ctx2.setTransform(1, 0, 0, 1, 0, 0);
  // ctx2.translate(m.offsetTopLeft.x, m.offsetTopLeft.y);

  // ctx3.setTransform(1, 0, 0, 1, 0, 0);
  // ctx3.translate(m.offsetTopLeft.x, m.offsetTopLeft.y);

  
  // Calculates offset for rendering, this allows to render only tiles visible in canvas and few outside of it.
  // This if checks if the canvas can ignore map.zMin and/or man.zMax to avoid rendering unwanted tiles.

  let top = m.tilesOutsideCanvas.top /*- Math.floor( Math.abs( m.zMin ) / m.tileHeightHalf )*/ - 3,
      bottom = m.yTilesNumber /*- m.tilesOutsideCanvas.bottom + Math.floor( Math.abs( m.zMax ) / m.tileHeightHalf )*/ + 3,
      left = m.tilesOutsideCanvas.left - 3,
      right = m.xTilesNumber - m.tilesOutsideCanvas.right + 3;

  // render tiles under player's sprite    
  for( r = top; r < bottom + 3; r++ ) {
    if( r >= 0 && r < m.tiles.length ) {

      if( m.tiles[r][0].y <= p.y || ( p.y >= m.tiles[r][0].y && p.y <= m.tiles[r][0].y + m.tileHeightHalf ) ) {


        for( c = left - 3; c < right + 3; c++ ) {
          if( c >= 0 && c < m.tiles[r].length /*&&
              m.tiles[r][c].y + m.tiles[r][c].z > o - m.tileHeight &&
              m.tiles[r][c].y + m.tiles[r][c].z < o + canvasHeight + m.tileHeight*/ ) {           

            ctx1.drawImage (
              m.tiles[r][c].type,
              m.tiles[r][c].xAbsolute,
              m.tiles[r][c].yAbsolute + m.tiles[r][c].z
            )
          }          
        }
      }
    }
  }

  player.animate(ctx1);

  // render tiles above player's sprite
  for( r = top; r < bottom + 3; r++ ) {
    if( r >= 0 && r < m.tiles.length ) {

     for( c = left - 3; c < right + 3; c++ ) {
        if( c >= 0 && c < m.tiles[r].length /*&&
            m.tiles[r][c].y + m.tiles[r][c].z > o - 3 &&
            m.tiles[r][c].y + m.tiles[r][c].z < o + canvasHeight + 3*/ ) { 

          if( m.tiles[r][c].z < p.z && r === Math.floor( p.y / m.tileHeightHalf ) || r > Math.floor( p.y / m.tileHeightHalf ) ) {
            ctx1.drawImage (
              m.tiles[r][c].type,
              m.tiles[r][c].xAbsolute,
              m.tiles[r][c].yAbsolute + m.tiles[r][c].z
            )
          }          
        }          
      }
    }
  }



  // 3 canvas layer approach
//   // redner only tiles visible on canvas
//   for(r = m.tilesOutsideCanvas.top - 3; r < m.tiles.length - m.tilesOutsideCanvas.bottom + 3; r++) {
//     if(r >= 0 && r < m.tiles.length) {

      
//       if(m.tiles[r][0].y < p.y || (p.y > m.tiles[r][0].y && p.y < m.tiles[r][0].y + m.tileHeightHalf)){
//         ctx = ctx1;
//       }

//       for(c = m.tilesOutsideCanvas.left - 3; c < m.tiles[r].length - m.tilesOutsideCanvas.right + 3; c++) {
//         if(c >= 0 && c < m.tiles[r].length) {
//           let img;
//           switch(m.tiles[r][c].type) {
//             case 1:
//               img = grass;
//               break;
//             case 2:
//               img = dirt;
//               break;
//             case 3:
//               img = mud;
//               break;
//             case 4:
//               img = water;
//               break;
//           }
//           if( Math.abs( m.tiles[r][c].z) > p.z && r === Math.floor( p.y / m.tileHeightHalf ) || r > Math.floor( p.y / m.tileHeightHalf ) ) {
//             ctx = ctx3;

//           } else if(m.tiles[r][c].z === p.z) {
//             ctx = ctx1;
//           }

//           ctx.drawImage(
//             img,
//             m.tiles[r][c].xAbsolute,
//             m.tiles[r][c].yAbsolute + m.tiles[r][c].z
//           )
//         }          
//       }      
//     }
//   }  
//
};

generateMap.prototype.renderOneTile = function(r, c, ctx){
  let m = this;
  
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(m.offsetTopLeft.x, m.offsetTopLeft.y);

  let img;
  switch(m.tiles[r][c].type) {
    case 1:
      img = grass;
      break;
    case 2:
      img = dirt;
      break;
    case 3:
      img = mud;
      break;
    case 4:
      img = water;
      break;
  };
  ctx.drawImage(
    img,
    m.tiles[r][c].xAbsolute,
    m.tiles[r][c].yAbsolute + m.tiles[r][c].elevation
  );
};