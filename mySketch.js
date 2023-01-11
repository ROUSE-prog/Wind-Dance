 let hu = 0;

 function setup() {
 	createCanvas(windowWidth, windowHeight);

 	colorMode(HSB, 200);
 	hu = random(255);
 	setObject();
 }

 let _aryRectXy = [];
 let _aryShift = [];
 let _numRect;
 let _aryColDirection = [];
 let _aryGridRect = [];
 let _numGridX;
 let _numGridY;
 let _rectTopW;
 let _rectBottomW;
 let _rectH;
 let _centX;
 let _centY;
 let _aryRectCornerShiftTop = [];
 let _aryRectCornerShiftBottom = [];

 function setObject() {
 	_minWidth = min(width, height) * 0.8; //1.4;//0.75;
 	_maxWidth = max(width, height) * 0.8; //1.4;//0.75;
 	stroke((hu + 120 + sin(frameCount / 300) * 120) % 255, 255, 255);
 	strokeWeight(0.1);
 	fill((hu + 120 + sin(frameCount / 300) * 120) % 255, 255, 255);
 	_numRect = 5; //3;
 	_rectTopW = _minWidth; //width;//_minWidth;
 	_rectBottomW = _minWidth; //width;//_minWidth;
 	_rectH = _minWidth / 4; //height;//_minWidth;
 	_centX = 100;
 	_centY = 100;
 	_aryRectCornerShiftTop = [];
 	_aryRectCornerShiftBottom = [];
 	_aryShift = [];
 	_aryColDirection = [];
 	for (let i = 0; i < _numRect; i++) {
 		_aryRectCornerShiftTop[i] = [random(1000), random(4 * PI / 360, 4 * PI / 300)]; //[init shift phase, shift speed]
 		_aryRectCornerShiftBottom[i] = [random(1000), random(5 * PI / 360, 5 * PI / 300)]; //[init shift phase, shift speed]
 		_aryShift[i] = [_minWidth / 10, random(1000), random(2 * PI / 360, 2 * PI / 300)]; //[shift length, init shift phase, shift speed]
 		_aryColDirection[i] = random(["up", "down", "right", "left"]);
 	}

 	_numGridX = 20; //200;
 	_numGridY = 20; //800;
 	_aryGridRect = [];
 	for (let i = 0; i < _numRect; i++) {
 		let colCode = "#" + "FFFFFF";
 		let maxRecursion = 12; //9;//7;
 		let clearance = 1; //8;//20;
 		_aryGridRect.push(new GridRect(0, 0, _numGridX, _numGridY, maxRecursion, 0, clearance, _aryColDirection[i], colCode));
 	}
 }

 class GridArea {
 	constructor(xyTopLeft, xyTopRight, xyBottomRight, xyBottomLeft, numGridX, numGridY, colCode, colDirection) {
 		this.xyTopLeft = xyTopLeft;
 		this.xyTopRight = xyTopRight;
 		this.xyBottomRight = xyBottomRight;
 		this.xyBottomLeft = xyBottomLeft;
 		this.numGridX = numGridX;
 		this.numGridY = numGridY;
 		this.aryGridXy = [];
 		for (let xi = 0; xi < numGridX + 1; xi++) {
 			this.aryGridXy[xi] = [];
 			for (let yi = 0; yi < numGridY + 1; yi++) {
 				let xyTop = p5.Vector.lerp(xyTopLeft, xyTopRight, xi / numGridX);
 				let xyBottom = p5.Vector.lerp(xyBottomLeft, xyBottomRight, xi / numGridX);
 				let xy = p5.Vector.lerp(xyTop, xyBottom, yi / numGridY);
 				this.aryGridXy[xi][yi] = xy;
 			}
 		}
 	}
 }

 class GridRect {
 	constructor(startXi, startYi, endXi, endYi, maxRecursion, countRecursion, clearance, colDirection, colCode) {
 		this.startXi = startXi;
 		this.startYi = startYi;
 		this.endXi = endXi;
 		this.endYi = endYi;
 		this.maxRecursion = maxRecursion;
 		this.countRecursion = countRecursion;
 		this.clearance = clearance;
 		this.subRects = [];
 		this.colDirection = colDirection; //"up" "down" "right" "left"

 		if (random() < 1.6 && this.countRecursion < this.maxRecursion) {
 			this.recursion();
 		}
 	}

 	recursion() {
 		if (random() < 1) { //vertical division
 			if (this.endXi > this.startXi + 1 + this.clearance) {
 				let divideXi1 = this.startXi + 1 + int(random(this.endXi - this.startXi - 1 - this.clearance));
 				let divideXi2 = divideXi1 + this.clearance;
 				this.subRects[0] = new GridRect(this.startXi, this.startYi, divideXi1, this.endYi, this.maxRecursion, this.countRecursion + 1, this.clearance, this.colDirection, this.colCode);
 				this.subRects[1] = new GridRect(divideXi2, this.startYi, this.endXi, this.endYi, this.maxRecursion, this.countRecursion + 1, this.clearance, this.colDirection, this.colCode);
 			}
 		} else { // horisontal division
 			if (this.endYi > this.startYi + 1 + this.clearance) {
 				let divideYi1 = this.startYi + 1 + int(random(this.endYi - this.startYi - 1 - this.clearance));
 				let divideYi2 = divideYi1 + this.clearance;
 				this.subRects[0] = new GridRect(this.startXi, this.startYi, this.endXi, divideYi1, this.maxRecursion, this.countRecursion + 1, this.clearance, this.colDirection, this.colCode);
 				this.subRects[1] = new GridRect(this.startXi, divideYi2, this.endXi, this.endYi, this.maxRecursion, this.countRecursion + 1, this.clearance, this.colDirection, this.colCode);
 			}
 		}
 	}

 	draw(aryGridXy) {
 		if (this.subRects.length == 0) {
 			let limitGridXi = 10000;
 			let limitGridYi = 10000;
 			let lengthXi = this.endXi - this.startXi;
 			let lengthYi = this.endYi - this.startYi;
 			if (lengthXi <= limitGridXi ||
 				lengthYi <= limitGridYi) {

 				push();
 				beginShape();
 				if (this.colDirection == "up") {
 					vertex(aryGridXy[this.endXi][this.endYi].x, aryGridXy[this.endXi][this.endYi].y);
 					vertex(aryGridXy[this.startXi][this.endYi].x, aryGridXy[this.startXi][this.endYi].y);
 					vertex(aryGridXy[this.startXi][this.startYi].x, aryGridXy[this.startXi][this.startYi].y);
 					vertex(aryGridXy[this.endXi][this.startYi].x, aryGridXy[this.endXi][this.startYi].y);
 				}
 				endShape(CLOSE);
 				pop();
 			}
 		} else {
 			this.subRects[0].draw(aryGridXy);
 			this.subRects[1].draw(aryGridXy);
 		}
 	}
 }

 function draw() {
 	background(10, 10);
 	translate(width / 2, height / 2);

 	let aryTopValue = [0];
 	let aryBottomValue = [0];
 	for (let i = 0; i < _numRect; i++) {
 		aryTopValue.push(aryTopValue[i] + sin(_aryRectCornerShiftTop[i][0] + _aryRectCornerShiftTop[i][1] * frameCount) * 0.5 + 0.5);
 		aryBottomValue.push(aryBottomValue[i] + sin(_aryRectCornerShiftBottom[i][0] + _aryRectCornerShiftBottom[i][1] * frameCount) * 0.5 + 0.5);
 	}

 	let aryTopRatio = [0];
 	let aryBottomRatio = [0];
 	for (let i = 1; i <= _numRect; i++) {
 		aryTopRatio[i] = aryTopValue[i] / aryTopValue[_numRect];
 		aryBottomRatio[i] = aryBottomValue[i] / aryBottomValue[_numRect];
 	}

 	_aryRectXy = [];
 	for (let i = 0; i < _numRect; i++) {
 		let xy1 = createVector(_centX - _rectTopW / 2 + _rectTopW * aryTopRatio[i], _centY - _rectH / 2);
 		let xy2 = createVector(_centX - _rectTopW / 2 + _rectTopW * aryTopRatio[i + 1], _centY - _rectH / 2);
 		let xy3 = createVector(_centX - _rectBottomW / 2 + _rectBottomW * aryBottomRatio[i + 1], _centY + _rectH / 2);
 		let xy4 = createVector(_centX - _rectBottomW / 2 + _rectBottomW * aryBottomRatio[i], _centY + _rectH / 2);
 		_aryRectXy[i] = [xy1, xy2, xy3, xy4];
 	}

 	let aryShiftXy = [];
 	aryShiftXy[0] = createVector(0, 0);
 	let thisAryRectXy = [];
 	for (let i = 0; i < _numRect; i++) {
 		let shiftValue = _aryShift[i][0] * cos(_aryShift[i][1] + _aryShift[i][2] * frameCount);
 		let shiftXy = p5.Vector.sub(_aryRectXy[i][2], _aryRectXy[i][1]).normalize().setMag(shiftValue);
 		aryShiftXy[i + 1] = p5.Vector.add(aryShiftXy[i], shiftXy);
 		thisAryRectXy[i] = [];
 		for (let j = 0; j < 4; j++) {
 			thisAryRectXy[i][j] = p5.Vector.add(_aryRectXy[i][j], aryShiftXy[i]);
 		}
 	}

 	for (let i = 0; i < _numRect; i++) {
 		let xy1 = thisAryRectXy[i][0];
 		let xy2 = thisAryRectXy[i][1];
 		let xy3 = thisAryRectXy[i][2];
 		let xy4 = thisAryRectXy[i][3];
 		let grid = new GridArea(xy1, xy2, xy3, xy4, _numGridX, _numGridY);
 		_aryGridRect[i].draw(grid.aryGridXy);
 	}
 }