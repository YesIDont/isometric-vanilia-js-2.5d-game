// Custom message constructor
function customMessage(ctx, message, x, y, xOffset, yOffset, fontSize, resetCanvasTransform) {
	if(resetCanvasTransform) {ctx.setTransform(1, 0, 0, 1, 0, 0);}
  
  ctx.save();
  ctx.font = fontSize + "px Bold Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText(message, x + xOffset, y + yOffset);
  ctx.restore();
};

// returns true or false randomly and alows to specify
// chance of the outcome in %. 
function trueOrFalse (chance) {
  var n = Math.round( Math.random() * 1 ) === 1 ? true : false;
  return n;
}

// Draws random number from specyfied range.
// Argument must be > 0. Range is offset by -1, as it always
// starts with 0
function random (r) {
  var n = r === undefined || r === false || r < 2 ? 1 : r - 1;
  var random = Math.round( Math.random() * n);
  return random;
}

function l(n) {
  console.log(n);
}

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

function bezierFromPointToPoint
  (
    x1, y1, // staring point coordinates
    x2, y2, // ending point cooridantes
    xB, yB  // bezier mod - by how much line will be bend
  )
{
  var x, y;

  ctx.moveTo(x1, y1);

  for(t=0; t <= 1; t += 0.01)
  {
    x = (1 - t) * (1 - t) * x1 + 2 * (1-t) * t * xB + t * t * x2;
    y = (1 - t) * (1 - t) * y1 + 2 * (1-t) * t * yB + t * t * y2;

    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
var isGameOver = false;

// massage on dark background
function messageWindow(txt) {
  var info = document.createElement("div");
  info.id = "message";
  info.innerHTML = txt;
  var body = document.getElementsByTagName("body");
  body[0].appendChild(info);
}