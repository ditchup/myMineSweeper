"use strict"
console.log("imagebank.stuff.js!")
// img要素を使い、画像を表示する。
// かっちりロード管理するともっと大きくなる。

stuff.imagebank = {};
stuff.imagebank.images = {};

// 画像ファイルをロードし、img要素に割り当てる。
// アクセス用の文字列をキー、ファイルパスを値として持つオブジェクトを受け取る
stuff.imagebank.load = function (imgfile_indexes) {
	var img, key;
	for (key in imgfile_indexes) {
		img = new Image();
		img.src = imgfile_indexes[key];
		stuff.imagebank.images[key] = img;
	}

	return stuff.imagebank.images;
};

