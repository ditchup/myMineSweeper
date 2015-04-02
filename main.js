// サブライブラリのロード
var sprout = stuff.sprout;
sprout("easycanvas");//.onload = function () {console.log("easycanvas onload")};
sprout("dom");
sprout("matrix");
var imagebankElem = sprout("imagebank");

// いつでもアクセスしたい定数
var P = {
	GAMEWIDTH: 288,
	GAMEHEIGHT: 288,
	MATRIXSIZE: 9,
	BOMBNUM: 10,
};

// 画像ファイルの指定
// プログラム中での呼び方とファイルパス
var imgIndexes = {
	"block": "img/block.png",
	"flagblock": "img/flag_block.png",
	"floor": "img/floor.png",
	"bomb": "img/mine.png",
	"redfloor": "img/redfloor.png",
	"icons": "img/nums2.png",
	//"icons": "img/nums3.png",
};

//画像の読み込み 
if (stuff.imagebank !== undefined) {
	stuff.imagebank.load(imgIndexes);
} else {
	imagebankElem.onload = function () {
		stuff.imagebank.load(imgIndexes);
		// imgIndexesの中身が得られないので、sproutの返り値が得られたときにはonloadの中身を書けない。
	};
}
imagebankElem = null;

// ゲーム実行中にオブジェクトにアクセスするためのグローバル変数。
// 見たいオブジェクトをここに登録する。
var debug = {};

window.onload = function () {
	console.log("window onload");
	document.body.style.backgroundColor = "black";

	// 手抜き用関数
	// 0~(int_num-1)のランダムな整数値を返す
	function getRandomIntager(int_num) {
		return Math.floor(Math.random() * int_num);
	}
	
	// ゲーム中で使用するパラメータ
	var openedNum = 0;
	var istouchable = true; // タッチ操作を受け付けるかどうか
	
	// canvas要素作成
	var ctx = stuff.easycanvas.setup(P.GAMEWIDTH, P.GAMEHEIGHT);
	var canvas = ctx.canvas;

	/*
	canvas.addEventListener("mousemove", function (e) {
		ctx.fillStyle = P.BLACKCOLOR;
		ctx.fillRect(Math.floor(e.layerX), Math.floor(e.layerY), 10, 10);
		// layerX: イベント登録された要素左上を基点とする。
		// clientX, x: HTML左上を基点、screenX: PC画面左上を基点
	})
	*/
	
	var mv = stuff.dom.move;
	mv(canvas, 16, 16);

	
	// 土台作り

	/*
	 * 表面の状態。未開封だと床の数値や爆弾が見えない。
	 * 0: 開封, 1: 未開封, 2: フラグ付き未開封
	 * */
	var surfaceMap = stuff.matrix.stuffingsetup(P.MATRIXSIZE, P.MATRIXSIZE, 1);

	/*
	 * 床の状態。
	 * 0～8: 爆弾はない。数値は周囲にある爆弾の数を表す
	 * 9: 爆弾がある
	*/
	var floorMap = stuff.matrix.stuffingsetup(P.MATRIXSIZE, P.MATRIXSIZE, 0);

	// surfaceとfloorを指定しないといけないのは面倒かな?

	// i, jの周囲1マスの数値を1増やす。（9のところは無視する。）
	floorMap.incrementAround = function (bomb_i, bomb_j) {
		var i, j;
		var i_min = Math.max(bomb_i-1, 0);
		var i_max = Math.min(P.MATRIXSIZE-1, bomb_i+1);
		var j_min = Math.max(bomb_j-1, 0);
		var j_max = Math.min(P.MATRIXSIZE-1, bomb_j+1);

		for (i = i_min; i <= i_max; i++) {
			for (j = j_min; j <= j_max; j++) {
				if (floorMap[i][j] !== 9) {
					// bomb_i, bomb_jは9が入ってるはずなので・・・ちょっと汚い。
					floorMap[i][j]++;
				}
			}
		}	
	}

	// 爆弾ランダム配置
	// ign_i, ign_jの周囲1マスには置かない
	// 「周りの爆弾の数」も与える。
	floorMap.setBomb = function (bomb_num, ign_i, ign_j) {
		var i, j;
		var b = 0;
		var i_max = P.MATRIXSIZE, j_max = P.MATRIXSIZE;

		while (b < bomb_num) {
			j = getRandomIntager(i_max * j_max);
			i = Math.floor(j / j_max);
			j = j % j_max;

			if (Math.abs(i - ign_i) <= 1 && Math.abs(j - ign_j) <= 1
				|| floorMap[i][j] === 9) {
				continue;
			} else {
				floorMap[i][j] = 9; // 爆弾
				floorMap.incrementAround(i, j); // 周りのマスの数値を増やす
				b++;
			}
		}

	};
	
	// 全種類の数字が表示されるように爆弾を配置する
	floorMap.setBombSample = function () {
		var set = function (i, j) {
			floorMap[i][j] = 9;
			floorMap.incrementAround(i, j);
		};

		set(4, 4);
		set(5, 4);
		set(2, 5);
		set(2, 6);
		set(3, 6);
		set(4, 6);
		set(4, 5);
		set(6, 5);
		set(6, 6);
		set(5, 6);
		set(6, 7);
		set(6, 8);
		set(5, 8);
		set(4, 8);
		set(4, 7);
		set(8, 5);
	}

	// どうやって描画するか
	var images = stuff.imagebank.images; // window.onload外でロード済みのimg要素群

	// img要素からcanvasへの描画。
	// ctx, surfaceMap, floorMap、imagesなどを定義時のスコープで参照する。
	
	// 数字を描画。
	// nums.png専用。
	var drawNumber = function (num, x, y) {
		if (num <= 0 || num >= 9) {
			return;
		}

		// 切り出し位置
		var sx = (num-1) * 16;
		// 数字をマスの中央に表示するため左と下に8ずつずらす。
		ctx.drawImage(images.icons, sx, 0, 16, 16, x+8, y+8, 16, 16);
	};

	// マスの描画
	var drawSquare = function (i, j, isredfloor) {
		var x = 32*i, y = 32*j;

		// 開封していないなら表面だけ書いて終了
		if (surfaceMap[i][j] === 2) {
			ctx.drawImage(images.flagblock, x, y);
			return;
		} else if (surfaceMap[i][j] === 1) {
			ctx.drawImage(images.block, x, y);
			return;
		}

		// 開封していたら床を描いた後数値や爆弾も描く
		ctx.drawImage(images.floor, x, y);

		var floorval = floorMap[i][j];
		if (floorval === 9) {
			if (isredfloor) { //爆弾の時だけチェック。重ねて描く。
				ctx.drawImage(images.redfloor, x, y);
			}
			ctx.drawImage(images.bomb, x, y);
		} else if (floorval >= 1) {
			drawNumber(floorval, x, y);
		}
	}

	// 開封
	var open = function (i, j, isredfloor) {
		surfaceMap[i][j] = 0;
		drawSquare(i, j, isredfloor);
		openedNum++;
	};

	// 連鎖開封
	// データを変更しつつ、描画も行う。
	//TODO 自分で開封したマスも毎回調べるので無駄、別の調べ方を調査する。
	var open8dir = function (i_open, j_open) {
		var buffer = [];
		var square_open;
		var i, j;
		var i_min, i_max, j_min, j_max;

		open(i_open, j_open);

		// 床に数値・爆弾があったら連鎖して開かない
		// 無駄がある気がする
		if (floorMap[i_open][j_open] > 0) {
			return;
		}

		// 周囲の未開封のマスを調べ、数字がなければその周囲も調べる
		while (true) {
			i_min = Math.max(i_open-1, 0);
			i_max = Math.min(i_open+1, P.MATRIXSIZE-1);
			j_min = Math.max(j_open-1, 0);
			j_max = Math.min(j_open+1, P.MATRIXSIZE-1);

			for (i = i_min; i <= i_max; i++) {
				for (j = j_min; j <= j_max; j++) {
					if (surfaceMap[i][j] !== 0) { // 未開封
						// 数字のないマスならbufferに追加し、その周囲も調べる
						if (floorMap[i][j] === 0) { 
							buffer.push([i, j]);
						}
						open(i, j);
					}
				}
			}

			// bufferにマスが登録されているか調べる
			// 何もなければ終了する
			if (buffer.length > 0) {
				// square_openは無くせないか?
				square_open = buffer.shift();
				i_open = square_open[0];
				j_open = square_open[1];
			} else {
				break;
			}
		}

	};

	// すべての爆弾が存在するマスを開封する
	var openAllBomb = function () {
		for (i = 0; i < P.MATRIXSIZE; i++) {
			for (j = 0; j < P.MATRIXSIZE; j++) {
				if (surfaceMap[i][j] !== 0 && floorMap[i][j] === 9) {
					open(i, j);
				}
			}
		}
	};

	// すべての爆弾が存在するマスに旗を立てる
	var setFlagAllBomb = function () {
		for (i = 0; i < P.MATRIXSIZE; i++) {
			for (j = 0; j < P.MATRIXSIZE; j++) {
				if (surfaceMap[i][j] !== 0 && floorMap[i][j] === 9) {
					surfaceMap[i][j] = 2;
					drawSquare(i, j);
				}
			}
		}
	};

	// HTMLを再読み込みし、ゲームをリセットする
	var roughreset = function () {
		location.reload();
	};

	// 変数と表示を初期化し、ゲームをリセットする
	var softreset = function () {
		openedNum = 0;
		istouchable = true;

		stuff.matrix.stuffingreset(surfaceMap, 1);
		stuff.matrix.stuffingreset(floorMap, 0);

		var i, j;
		for (i = 0; i < P.MATRIXSIZE; i++) {
			for (j = 0; j < P.MATRIXSIZE; j++) {
				drawSquare(i, j);
			}
		}
	};

	// プレイヤーがマウスで押したときに反応するハンドラ。
	// ほぼゲームの本体。
	var onclick = function (e) {
		var i, j;
		i = Math.floor(e.layerX / 32);
		j = Math.floor(e.layerY / 32);
		
		// タッチ操作を無視する指定があるとき無視する。（クリア時、ゲームオーバー時）
		if (istouchable === false) {
			softreset();
			return;
		}

		// 開封済みなら無視する
		if (surfaceMap[i][j] === 0) {
			return;
		}

		// 最初の開封なら、爆弾の位置を決める
		if (openedNum === 0) {
			floorMap.setBomb(P.BOMBNUM, i, j);

			// 数値チップの表示テスト（1~8まで表示）
			//floorMap.setBombSample();
		}

		// ゲームオーバー
		// 爆弾だった。
		if (floorMap[i][j] === 9) {
			// isredfloor引数にtrueを与え、床を赤く塗る。
			open(i, j, true);

			// 全部走査するので無駄・・・
			openAllBomb();

			// 以後、開封操作できなくする
			istouchable = false;
			//alert("boom!");

			return;
		}

		// 空白マスを一気に開く
		open8dir(i, j);

		// クリア判定
		if (openedNum === P.MATRIXSIZE*P.MATRIXSIZE - P.BOMBNUM) {
			setFlagAllBomb();

			// 以後、開封操作できなくする
			istouchable = false;
			//alert("clear");

		}

		// 伝播防止
		if (e.stopPropagation) {
			e.stopPropagation();
		}
	}
	canvas.addEventListener("mousedown", onclick);

	var i, j;
	for (i = 0; i < P.MATRIXSIZE; i++) {
		for (j = 0; j < P.MATRIXSIZE; j++) {
			drawSquare(i, j);
		}
	}

};

// TODO
// 立ち上がりが遅い。表示して、ほぼ1秒経ってからクリックに反応する。
// クリア表示をもっと伝わりやすく（スプライト的にどーんと！）
// 自主リセット、フラグ。
