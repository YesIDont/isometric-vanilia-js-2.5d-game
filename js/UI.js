function newUiItem (element, text, cssClass, cssID, link, path, hoverPath, collapse, aria, defaultAction){
	this.el = element;
	this.node = document.createElement(this.el);
	this.text = text;	
	this.link = link;
	this.cssClass = cssClass;
	this.cssID = cssID;
	this.path = path;
	this.hoverPath = hoverPath;
	this.collapse = collapse;
	this.ariaExpanded = aria || false;
	this.enabled = false;
	this.action = defaultAction;
};

newUiItem.prototype.appendText = function() {
	this.node.innerHTML = this.text;
};

newUiItem.prototype.appendCSSclass = function() {
	this.node.className = this.cssClass;
};

newUiItem.prototype.appendCSSid = function() {
	this.node.id = this.cssID;
};
newUiItem.prototype.setCollapse = function() {
	this.node.setAttribute("data-toggle", "collapse");

	var that = this;
	if ( this.aria ) {
		var el = document.getElementById(that.cssID);
		el.classList.add("show");
	}
};

newUiItem.prototype.setBackground = function() {
	var that = this;
	var el = document.querySelector("head style#dynamicStyle").sheet;
	var background = "#" + this.cssID + " { background: transparent url(img/" + this.path + ") no-repeat top right }";
	var addHover = "#" + this.cssID + ":hover { background: transparent url(img/" + this.hoverPath + ") no-repeat top right; }";
	var addFocus = "#" + this.cssID + ":focus { background: transparent url(img/" + this.hoverPath + ") no-repeat top right; }";

	var l = el.cssRules.length;

	if("insertRule" in el) {
		el.insertRule(background, l);
		el.insertRule(addHover, l + 1);
		// el.insertRule(addFocus, l + 2);

	} else if("addRule" in el) {
		el.addRule(that.cssID, "background: transparent url(img/" + that.path + ") no-repeat top right }", l);
		el.addRule(that.cssID + ":hover", "background: transparent url(img/" + that.hoverPath + ") no-repeat top right;", l + 1);
		// el.addRule(that.ID + ":focus", "background: transparent url(img/" + that.hoverPath + ") no-repeat top right;", l + 2);
	}
}

newUiItem.prototype.appendLink = function() {
	if(this.node.tagName == "A") {
		this.node.href = this.link;
	}
};

newUiItem.prototype.listenCustomFunction = function(fnToDo) {
	this.node.addEventListener("click", fnToDo, false);
};

newUiItem.prototype.turnOnOff = function () {
	this.enabled = this.enabled === true ? false : true;
}

newUiItem.prototype.turnOnOffListen = function () {
	var that = this;
	this.node.addEventListener("click", function() {
		that.enabled = that.enabled === true ? false : true;
	}, false);
	
}

newUiItem.prototype.appendElement = function() {
	var destination = document.querySelector("#right-sidebar");
	var before = document.querySelector("#optionsBox");
	destination.insertBefore(this.node, before);
};

newUiItem.prototype.draw = function() {
	this.appendText();
	this.appendLink();
	this.appendCSSclass();
	this.appendCSSid();
	if( this.collapse ){ this.setCollapse() };
	this.setBackground();
	this.appendElement();
	this.turnOnOffListen();
};


function selectTiles() {
  var col,
  		m = map,
  		ctx = ctx1;
  
  var rP = Math.floor( ( mouse.y + Math.abs( m.offsetTopLeft.y) ) / m.tileHeightHalf );  
  var cP = Math.floor( ( mouse.x + Math.abs( m.offsetTopLeft.x) ) / m.tileWidth );

  for( r = rP - 2; r < rP + 2; r++ ) {
    if( r >= 0 && r < m.tiles.length ) {
      for( c = cP - 1; c < cP + 1; c++ ) {
        if( c >= 0 && c < m.tiles[r].length ) {

          var re = new SAT.Response();
          var t = m.tiles[r][c];
          // l(t);
          re.clear();          

          col = mousePoly.collidesWith(t.base, re);

          if( col ) {
						// l(t.r + " " + t.c);
            t.base.fill( ctx, "rgba(0, 110, 255, 0.5)", t.z ); // rgba(0, 110, 255, 0.5)
            // l(t.r + " " + t.c);
            t.base.stroke( ctx, "rgb(0, 0, 255)", t.z );
            t.base.stroke( ctx, "rgb(255, 0, 0)", 0 );

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            customMessage( ctx, "r: " + r, mouse.x, mouse.y, 40, -10, 20 );
            customMessage( ctx, "c: " + c, mouse.x, mouse.y, 40, 10, 20 );
            
            ctx1.translate(m.offsetTopLeft.x, m.offsetTopLeft.y);

            if( !mouse.isDown ) { m.selectedTile = t; };

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            customMessage( ctx, "z: " + m.selectedTile.z, mouse.x, mouse.y, 40, 30, 20 );
            customMessage( ctx, "mouse x: " + mouse.x, mouse.x, mouse.y, 40, 50, 20 );
            customMessage( ctx, "mouse y: " + mouse.y, mouse.x, mouse.y, 40, 70, 20 );
            ctx1.translate(m.offsetTopLeft.x, m.offsetTopLeft.y);
          }
        }  
      }
    }
  }
}