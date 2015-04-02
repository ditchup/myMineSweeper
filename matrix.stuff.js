"use strict"
console.log("matrix.stuff.js!");

// 2次元配列を作成する。
stuff.matrix = {};

stuff.matrix.setup = function (size) {
	var i;
	var matrix = [];

	for (i = 0; i < size; i++) {
		matrix[i] = [];
	}

	return matrix;
};

// 詰め物をする。
// 単に各要素に対して値を与える。参照をたどったりはしない。
stuff.matrix.stuffingsetup = function (size1, size2, stuffing) {
	var i, j;
	var matrix = [];

	for (i = 0; i < size1; i++) {
		matrix[i] = [];
		for (j = 0; j < size2; j++) {
			matrix[i][j] = stuffing;
		}
	}

	return matrix;
};

stuff.matrix.stuffingreset = function (matrix, stuffing) {
	var i, j;

	for (i = 0; i < matrix.length; i++) {
		for (j = 0; j < matrix[0].length; j++) {
			matrix[i][j] = stuffing;
		}
	}

	return matrix;
};

