"use strict"
console.log("dom.stuff.js!");


stuff.dom = {};

// 要素位置の指定
stuff.dom.move = function(elem, x, y) {
	elem.style.left = x;
	elem.style.top = y;
};

// 要素の上下関係
stuff.dom.over = function(upperElem, underElem) {
	var underZIndex = Number(underElem.style.zIndex);
	
	upperElem.style.zIndex = underZIndex + 1;
};

// 要素位置を数値として取得
stuff.dom.getX = function (elem) {
	return parseFloat(elem.style.left);
};
stuff.dom.getY = function (elem) {
	return parseFloat(elem.style.top);
};

