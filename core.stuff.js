"use strict"
console.log("core.stuff.js!");

// 名前空間? 
if (stuff === undefined) {
	var stuff = {
	};
} else {
	console.log("variable name 'stuff' is already used");
}

stuff.sprout = function sprout(libname) {
	// ロード済みかのチェック
	if (stuff[libname] !== undefined && stuff[libname] !== null) {
		return;
	}

	var head = document.getElementsByTagName("head")[0];
	
	var s = document.createElement("script");
	s.src = libname + ".stuff.js";	// ブロッキングしない。要素のonloadハンドラは有効
	// src属性への代入時に実際のURL（アクセス方法つき）に補完される
	
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

// ・・・追加ライブラリまでまとめて1つのファイルとして出力する（文字列を作る）functionの文字列化で何とか？


//目的
// 小型のゲームを作るために、
// html（特にcanvas）への操作（ドキュメントへの追加・属性設定・検索？）、
// イベントへの反応設定、
// （追加）図形の描画
// （追加）画像データ（音？）の取得・管理
// （追加）CSS効果
// などのjsの機能を使いやすい形でまとめておく。


// つまらないものは忘れられる。
