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

var isGameOver = false;

// massage on dark background
function messageWindow(txt) {
  var info = document.createElement("div");
  info.id = "message";
  info.innerHTML = txt;
  var body = document.getElementsByTagName("body");
  body[0].appendChild(info);
}