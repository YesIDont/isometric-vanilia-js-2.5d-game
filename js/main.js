// Create the canvas
// ===========================================================
let layer1 = document.createElement("canvas"),
    // layer2 = document.createElement("canvas"),
    // layer3 = document.createElement("canvas"),
    ctx1 = layer1.getContext("2d"),
    // ctx2 = layer2.getContext("2d"),
    // ctx3 = layer3.getContext("2d"),
    canvasWidth, canvasHeight, canvasWidthHalf, canvasHeightHalf, xMouse, yMouse;

    // below is used when dynamicly creting css styles:
    // head letiable alows to refrence html head element
    // dynamicStyle is a style sheet that will be appended to html head space
    head = document.head || document.getElementsByTagName('head')[0],
    dynamicStyle = document.createElement('style');

    dynamicStyle.type = 'text/css';
    dynamicStyle.id = "dynamicStyle";
    dynamicStyle.setAttribute("media", "screen");
    // WebKit hack :(
    dynamicStyle.appendChild(document.createTextNode(""));
    head.appendChild(dynamicStyle);

layer1.className = "layer1";
// layer2.className = "layer2";
// layer3.className = "layer3";

function setCanvas() {
  canvasWidth = (window.innerWidth && document.documentElement.clientWidth ? 
                    Math.min(window.innerWidth, document.documentElement.clientWidth) : 
                    window.innerWidth || 
                    document.documentElement.clientWidth || 
                    document.getElementsByTagName('body')[0].clientWidth);
  canvasHeight = (window.innerHeight && document.documentElement.clientHeight ? 
                    Math.min(window.innerHeight, document.documentElement.clientHeight) : 
                    window.innerHeight || 
                    document.documentElement.clientHeight || 
                    document.getElementsByTagName('body')[0].clientHeight);

  canvasWidthHalf = Math.floor(canvasWidth * 0.5);
  canvasHeightHalf = Math.floor(canvasHeight * 0.5);

  layer1.width = canvasWidth;
  layer1.height = canvasHeight;

  // layer2.width = canvasWidth;
  // layer2.height = canvasHeight;

  // layer3.width = canvasWidth;
  // layer3.height = canvasHeight;
  
  let vignette = document.querySelector("#vignette");
  vignette.width = canvasWidth;
  vignette.height = canvasHeight;

  let container = document.querySelector(".container-fluid");
  container.style.width = canvasWidth;
  container.style.height = canvasHeight;
};
setCanvas();

document.body.appendChild(layer1);
// document.body.appendChild(layer2);
// document.body.appendChild(layer3);

// //canvas.style.background = "#000";

window.addEventListener("resize", setCanvas, false);


// Set animation engine width requestAnimationFrame
// ===========================================================
(function() {
  let lastTime = 0;
  let vendors = ['ms', 'moz', 'webkit', 'o'];
  for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                               || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
        let currTime = new Date().getTime();
        let timeToCall = Math.max(0, 16 - (currTime - lastTime));
        let id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}());


// generate map
// ===========================================================
let map = new generateMap(
  256,    // horizontal number of tiles
  256,    // vertical number of tiles
  74,       // tile twidth
  40,       // tile heigh
  "center",  // map starting x position
  "center",   // map starting y position
  0           // number of tiles on the outside of map to clip out of camera (canvas) movment area
);



// create player
let player = new createCharacter(
  3 // movment speed
);


// Calculation to be made before game starts and after map and characters where created
map.startPositionSwitch(map.startPosition_x, map.startPosition_x, player);
player.collisionModel = new player.calcCollisionModel(map, player);


// create UI
// element, text, css, link, path
let buttonOptions = new newUiItem("a", "", "button", "options", "#right-sidebar", "ico-options.svg", "ico-options-h.svg", true);
let selectTool = new newUiItem("a", "", "button", "select-tool", "#", "ico-select-tool.svg", "ico-select-tool-h.svg", false);


// Keyboard controls
// ===========================================================
let keysDown = [];

function pressKey(e) {
  keysDown[e.keyCode] = true;
}

function releaseKey(e) {
  delete keysDown[e.keyCode];
}

document.addEventListener("keydown", pressKey, false);
document.addEventListener("keyup", releaseKey, false);


// Mouse controls
// ===========================================================

// Mouse collision point
let mousePoly = new P(new V(-1, -1), [
  new V(1, 1),
  new V(1, 1),
  new V(1, 1),
  new V(1, 1)
]);

// Tracking mouse position
document.onmousemove = function (e) {  
  e = e || window.event;
  xMouse = e.pageX;
  yMouse = e.pageY;

  // IE 8
  if (xMouse === undefined) {
    xMouse = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    yMouse = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  
  mousePoly.pos.x = xMouse + Math.abs( map.offsetTopLeft.x );
  mousePoly.pos.y = yMouse + Math.abs( map.offsetTopLeft.y );
}


// The main game loop
// ===========================================================
let animate = function () {
  // this allows for acurate canvas clean,
  // without it canvas would be cleaned based on it's offset position
  ctx1.setTransform(1, 0, 0, 1, 0, 0);
  ctx1.clearRect(0, 0, canvasWidth, canvasHeight);

  // ctx2.setTransform(1, 0, 0, 1, 0, 0);
  // ctx2.clearRect(0, 0, canvasWidth, canvasHeight);

  // ctx3.setTransform(1, 0, 0, 1, 0, 0);
  // ctx3.clearRect(0, 0, canvasWidth, canvasHeight);  
  
  map.render(player);

  player.collisionModel.testPosition(map, player);  
  player.move(map, player);
  map.cameraUpdate(map, player.x, player.y, player.z);
    
  
  

  if(selectTilesSwitch){fillSelectedTile(ctx1, map)}

    if(devToolsSwitch){devTools(ctx1);}

  // Request to do this again ASAP 
  requestAnimationFrame(animate);
};

// Start animation right after page is loaded
// ===========================================================
window.addEventListener("load", function() {
  animate();

  // Let there be UI!
  buttonOptions.draw();
  buttonOptions.listen(devToolsSwitcher);

  selectTool.draw();
  selectTool.listen(selectTilesSwitcher)
});