function newUiItem (element, text, cssClass, cssID, link, path, hoverPath, collapse){
	this.el = element;
	this.node = document.createElement(this.el);
	this.text = text;	
	this.link = link;
	this.cssClass = cssClass;
	this.cssID = cssID;
	this.path = path;
	this.hoverPath = hoverPath;
	this.collapse = collapse;
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

newUiItem.prototype.listen = function(fnToDo) {
	let node = this.node;
	node.addEventListener("click", fnToDo, false);
};

newUiItem.prototype.appendElement = function(fnToDo) {
	let destination = document.querySelector("#right-sidebar");
	let before = document.querySelector("#optionsBox");
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
};
