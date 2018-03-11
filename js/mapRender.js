// render function displays tiles images and updates their position with player velocity
generateMap.prototype.render = function(playerObject){
  let that = this;
  let p = playerObject;
  // let ctx = ctx1;
  
  ctx1.setTransform(1, 0, 0, 1, 0, 0);
  ctx1.translate(that.offsetTopLeft.x, that.offsetTopLeft.y);

  // ctx2.setTransform(1, 0, 0, 1, 0, 0);
  // ctx2.translate(that.offsetTopLeft.x, that.offsetTopLeft.y);

  // ctx3.setTransform(1, 0, 0, 1, 0, 0);
  // ctx3.translate(that.offsetTopLeft.x, that.offsetTopLeft.y);

  // render tiles under player's sprite
  for( r = that.tilesOutsideCanvas.top - 3; r < that.tiles.length - that.tilesOutsideCanvas.bottom + 3; r++ ) {
    if( r >= 0 && r < that.tiles.length ) {

      if( that.tiles[r][0].y <= p.y || (p.y >= that.tiles[r][0].y && p.y <= that.tiles[r][0].y + that.tileHeightHalf ) ) {

        for( c = that.tilesOutsideCanvas.left - 3; c < that.tiles[r].length - that.tilesOutsideCanvas.right + 3; c++ ) {
          if( c >= 0 && c < that.tiles[r].length ) {

            let img;
            
            switch(that.tiles[r][c].type) {
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
            }

            ctx1.drawImage (
              img,
              that.tiles[r][c].xAbsolute,
              that.tiles[r][c].yAbsolute + that.tiles[r][c].z
            )
              
          }          
        }
      }
    }
  }

  player.animate(ctx1);

  // render tiles above player's sprite
  for(r = that.tilesOutsideCanvas.top - 3; r < that.tiles.length - that.tilesOutsideCanvas.bottom + 3; r++) {
    if(r >= 0 && r < that.tiles.length) {
      for( c = that.tilesOutsideCanvas.left - 3; c < that.tiles[r].length - that.tilesOutsideCanvas.right + 3; c++ ) {
        if( c >= 0 && c < that.tiles[r].length ) {
          if( that.tiles[r][c].z < p.z && r === Math.floor( p.y / that.tileHeightHalf ) || r > Math.floor( p.y / that.tileHeightHalf ) ) {

            let img;

            switch(that.tiles[r][c].type) {
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
            }

            ctx1.drawImage (
              img,
              that.tiles[r][c].xAbsolute,
              that.tiles[r][c].yAbsolute + that.tiles[r][c].z
            )
          }          
        }          
      }
    }
  }



  // 3 canvas layer approach
//   // redner only tiles visible on canvas
//   for(r = that.tilesOutsideCanvas.top - 3; r < that.tiles.length - that.tilesOutsideCanvas.bottom + 3; r++) {
//     if(r >= 0 && r < that.tiles.length) {

      
//       if(that.tiles[r][0].y < p.y || (p.y > that.tiles[r][0].y && p.y < that.tiles[r][0].y + that.tileHeightHalf)){
//         ctx = ctx1;
//       }

//       for(c = that.tilesOutsideCanvas.left - 3; c < that.tiles[r].length - that.tilesOutsideCanvas.right + 3; c++) {
//         if(c >= 0 && c < that.tiles[r].length) {
//           let img;
//           switch(that.tiles[r][c].type) {
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
//           if( Math.abs( that.tiles[r][c].z) > p.z && r === Math.floor( p.y / that.tileHeightHalf ) || r > Math.floor( p.y / that.tileHeightHalf ) ) {
//             ctx = ctx3;

//           } else if(that.tiles[r][c].z === p.z) {
//             ctx = ctx1;
//           }

//           ctx.drawImage(
//             img,
//             that.tiles[r][c].xAbsolute,
//             that.tiles[r][c].yAbsolute + that.tiles[r][c].z
//           )
//         }          
//       }      
//     }
//   }  
//
};

generateMap.prototype.renderOneTile = function(r, c, ctx){
  let that = this;
  
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(that.offsetTopLeft.x, that.offsetTopLeft.y);

  let img;
  switch(that.tiles[r][c].type) {
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
    that.tiles[r][c].xAbsolute,
    that.tiles[r][c].yAbsolute + that.tiles[r][c].elevation
  );
};