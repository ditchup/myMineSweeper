"use strict"
console.log("easycanvas.stuff.js!");

if (stuff.easycanvas === undefined) {
	stuff.easycanvas = {};
} else {
	console.log("'stuff.easycanvas' is already exist");
}

stuff.easycanvas.setup = function (width, height, visibleframe) {
	var elem = document.createElement("canvas");
	elem.width = width;
	elem.height = height;
	document.body.appendChild(elem);
	
	// 画面左端に移動
	// tmlib tm.graphics.CanvasのresizeWindowを参考に
	elem.style.position = "absolute";
	elem.style.left = 0;
	elem.style.top = 0;
	
	var ctx = elem.getContext("2d");
	
	if (visibleframe !== false) {
		ctx.strokeRect(0, 0, width, height);
	}
	
	
	return ctx;
};


