function createSprite(path, x, y, rows, columns, frameCount, delay, scale, type, holdBreathTime, directionArray) {
	var that = this;
	this.isReady = false;
	this.file = new Image();
	this.file.src = path;
	this.fileSize();
	this.frameSize();
	this.rows = rows;
	this.columns = columns;
	this.frameCount = frameCount;
	this.currentFrame = 0;
	// coordinates of the animated sprite on and relative to canvas
	this.x = x;
	this.y = y;
  this.xy();
	// offset allowing to start animation in different column or row
  this.srcX = 0; 
  this.srcY = 0;
	this.delay = delay;
	this.dalayCounter = 0;
	this.scale = scale / 100;
	this.type = type; // type of animation, for now: simple (loop) (default) and breathing

	// once animation will reach frameCount it will stop for a while and than turn back in revers order
	this.holdBreathTime = holdBreathTime;
	this.hold = 0;
	this.directionMap = directionArray;
};

createSprite.prototype.updateFrame = function(sprite) {
	var s = sprite;
	if(s.type === "simple"){
	  if(s.delayCounter < s.delay){
	    s.delayCounter++;
	  } else {
	    s.currentFrame = ++s.currentFrame % s.frameCount;
	    s.delayCounter = 0;
	  }
	  s.srcX = s.currentFrame * s.frameWidth; 
	  
	} else if(s.type === "breathing") {
	  if(s.delayCounter < s.delay){
	    s.delayCounter++;

	  } else {
	    if(s.currentFrame < s.frameCount && s.currentFrame >= 0) {
	      s.currentFrame = ++s.currentFrame;
	      s.delayCounter = 0;
	    } else

	    if(s.currentFrame === s.frameCount) {
	      if(s.hold < s.holdBreathTime) {
	        s.hold++;
	      } else {
	        s.hold = 0;
	        s.currentFrame = -s.frameCount;
	      }
	    } else

	    if(s.currentFrame < 0){
	      s.currentFrame = ++s.currentFrame;
	      s.delayCounter = 0;
	    }
	  }
	  s.srcX = Math.abs(s.currentFrame) < s.frameCount ? Math.abs(s.currentFrame) * s.frameWidth : (s.frameCount - 1) * s.frameWidth; 
	}
};

createSprite.prototype.drawFrame = function(character, sprite, x, y, ctx) {
	var p = character;
	var s = sprite;	
	var sx = x - s.x;
	var sy = y - s.y;
	s.srcY = s.directionMap[p.spriteSheet.direction] * s.frameHeight;

	ctx.drawImage(s.file,
  s.srcX,
  s.srcY,
  s.frameWidth,
  s.frameHeight,
  sx,
  sy,
  s.frameWidth * s.scale,
  s.frameHeight * s.scale)         
};

createSprite.prototype.fileSize = function() {
	var that = this;
	window.addEventListener("load", function() {
		that.fileWidth = that.file.naturalWidth;
	  that.fileHeight = that.file.naturalHeight;
	}); 
};
createSprite.prototype.frameSize = function() {
	var that = this;
	window.addEventListener("load", function() {
		that.frameWidth = that.fileWidth / that.columns;
  	that.frameHeight = that.fileHeight / that.rows;
	});  
};

createSprite.prototype.xy = function() {
	var that = this;
	window.addEventListener("load", function() {
		that.x += ((that.fileWidth / that.columns) * 0.5);
  	that.y += (that.fileHeight / that.rows);
	});  
};