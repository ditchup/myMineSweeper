"use strict"
console.log("easycanvas.stuff.js!");

if (stuff.easycanvas === undefined) {
	stuff.easycanvas = {};
} else {
	console.log("'stuff.easycanvas' is already exist");
}

stuff.easycanvas.setup = function (width, height, visibleframe) {
	var elem = document.createElement("canvas");
	elem.height = width;
	elem.width = height;
	document.body.appendChild(elem);
	
	// 画面左端に移動
	// tmlib tm.graphics.CanvasのresizeWindowを参考に
	elem.style.position = "absolute"; // fixed? 入れられたとこで適当な場所に・・・
	elem.style.left = 0;
	elem.style.top = 0;
	
	var ctx = elem.getContext("2d");
	
	if (visibleframe !== false) {
		ctx.strokeRect(0, 0, width, height);
	}
	
/*	
	// ×書きにくかった
	// イベントに対する処理を指定されていたら、イベントリスナでDOM要素に登録する
	// OpenGLのステートマシン風
	if (typeof(stuff.easycanvas.clickfunc) === "function") {
		elem.addEventListener("click", stuff.easycanvas.clickfunc);
		//一回ずつリセット？
		//stuff.easybutton.clickfunc = null;
	}
	
	
*/
	
	return ctx;
};

// jQueryとかの書き方？
// ・・・書けない
/*stuff.easycanvas.click = function (func) {
	
}*/

