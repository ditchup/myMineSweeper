"use strict"
console.log("core.stuff.js!");

// 名前空間
if (stuff === undefined) {
	var stuff = {
	};
} else {
	console.log("variable name 'stuff' is already used");
}

stuff.sprout = function sprout(libname) {
	// ロード済みかチェック
	if (stuff[libname] !== undefined && stuff[libname] !== null) {
		return;
	}

	var head = document.getElementsByTagName("head")[0];
	
	var s = document.createElement("script");
	s.src = libname + ".stuff.js";
	head.appendChild(s);
	
	return s;
};

// 任意のjsスクリプトのロードを行う
stuff.load = function (scriptPath) {
	var head = document.getElementsByTagName("head")[0];
	
	var s = document.createElement("script");
	s.src = scriptPath
	head.appendChild(s);
	
	return s;
};


// JavaScript 6版 p349より
/*
function loadasync(url) {
	var head = document.getElementsByTagName("head")[0];
	var s = document.createElement("script");
	s.src = url;
	head.appendChild(s);
	
	// 削除用に変更
	return s;
}
*/

