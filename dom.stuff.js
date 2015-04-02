"use strict"
console.log("dom.stuff.js!");

//機能としては、jsのDOMで十分。
//core.stuff.jsでは不足している機能の追加を行ったが、
//これは、実際に作るときに、細かい部分を意識させないためのライブラリにする？
//（モデルを作り、それに従って作ってもらう）

stuff.dom = {};

// DOMの機能メモ
// 木構造
// 要素の選択、縁故関係
// 要素の属性操作
// 要素のコンテンツ（innerHTMLなど）
// ノードの生成・挿入・削除
/*
var elem = document.createElement("canvas");
elem.height = 300;
elem.width = 300;
document.body.appendChild(elem);
var ctx = elem.getContext("2d");
ctx.fillRect(0, 0, 200, 200);
*/
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
// フォーム

// 要素位置を数値として取得
stuff.dom.getX = function (elem) {
	return parseFloat(elem.style.left);
};
stuff.dom.getY = function (elem) {
	return parseFloat(elem.style.top);
};

