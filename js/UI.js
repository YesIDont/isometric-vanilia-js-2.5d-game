function newUiItem (element, text, css, link, path, hoverPath){
	this.el = element;
	this.node = document.createElement(this.el);
	this.text = text;	
	this.link = link;
	this.cssClass = css;
	this.path = path;
	this.hoverPath = hoverPath;
};

newUiItem.prototype.appendText = function() {
	this.node.innerHTML = this.text;
};

newUiItem.prototype.appendCSSclass = function() {
	this.node.className = this.cssClass;
};

newUiItem.prototype.setBackground = function(){
	var that = this;
	var el = document.querySelector("head style#dynamicStyle").sheet;
	var background = "." + this.cssClass + " { background: transparent url(img/" + this.path + ") no-repeat top right }";
	var addHover = "." + this.cssClass + ":hover { background: transparent url(img/" + this.hoverPath + ") no-repeat top right; }";
	var addFocus = "." + this.cssClass + ":focus { background: transparent url(img/" + this.hoverPath + ") no-repeat top right; }";

	var l = el.cssRules.length;

	if("insertRule" in el) {
		el.insertRule(background, l);
		el.insertRule(addHover, l + 1);
		// el.insertRule(addFocus, l + 2);
	} else 
	if("addRule" in el) {
		el.addRule(that.cssClass, "background: transparent url(img/" + that.path + ") no-repeat top right }", l);
		el.addRule(that.cssClass + ":hover", "background: transparent url(img/" + that.hoverPath + ") no-repeat top right;", l + 1);
		el.addRule(that.cssClass + ":focus", "background: transparent url(img/" + that.hoverPath + ") no-repeat top right;", l + 2);
	}
}

newUiItem.prototype.appendLink = function() {
	if(this.node.tagName == "A") {
		this.node.href = this.link;
	}
};
newUiItem.prototype.listen = function(fnToDo) {
	let node = this.node;
	node.addEventListener("click", fnToDo, false);
};

newUiItem.prototype.draw = function() {
	this.appendText();
	this.appendLink();
	this.appendCSSclass();
	this.setBackground();
	document.body.appendChild(this.node);
};
