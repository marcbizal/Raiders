/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Tile_js__ = __webpack_require__(10);

var kTileTypesFile = './config/TileTypes.json';

class Map {
	constructor() {
		this.name = "";
		this.width = 0;
		this.height = 0;
		this.biome = "rock";

		// Load tile types
		this.tileTypes = null;
		this.loadTileTypes();

		this.tile = [];
		this.group = new THREE.Group();
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	getTileType(index) {
		if (tileTypes) {
			return tileTypes[index];
		} else {
			console.warn("getTileType() called before definitions were loaded.");
			return null;
		}
	}

	getY(x, z) {
		return this.getTile(Math.floor(x), Math.floor(z)).getY(x, z);
	}

	updateRect(top, left, width, height) {
		for (var y = top; y < height; y++) {
			for (var x = left; x < width; x++) {
				this.tile[y][x].update();
			}
		}
	}

	loadTileTypes(json) {
		var xhr = new XMLHttpRequest();

		var that = this;
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				that.tileTypes = JSON.parse(xhr.responseText);
			}
		};

		xhr.open('GET', kTileTypesFile, true);
		xhr.send();
	}

	load(filename, scene, callback) {
		var xhr = new XMLHttpRequest();

		var that = this;
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var data = JSON.parse(xhr.responseText);
				that.name = data.name;
				that.width = data.width;
				that.height = data.height;

				for (let y = 0; y < data.height; y++) {
					that.tile.push([]);
					for (let x = 0; x < data.width; x++) {
						// Set surf
						that.tile[y].push(new __WEBPACK_IMPORTED_MODULE_0__Tile_js__["a" /* default */](that, x, y));
						that.tile[y][x].surf = data.surf[y][x];
						that.tile[y][x].high = data.high[y][x];

						// Set undiscovered flag
						if (data.dugg[y][x] == 2) {
							that.tile[y][x].undiscovered = true;
						}
					}
				}

				for (let y = 0; y < data.height; y++) {
					for (let x = 0; x < data.width; x++) {
						that.tile[y][x].update();
						//that.group.add(that.tile[y][x].mesh);
					}
				}

				callback();
			}
		};

		xhr.open('GET', filename, true);
		xhr.send();

		console.log(this);
		scene.add(this.group);
	}

	getTile(x, y) {
		if (x >= this.width || x < 0 || y >= this.height || y < 0) {
			// Return an out-of-bounds tile
			return new __WEBPACK_IMPORTED_MODULE_0__Tile_js__["a" /* default */](null, x, y);
		} else {
			// Return the actual tile
			return this.tile[y][x];
		}
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Map);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Sound {
	constructor(url, context, callback) {
		this.context = context;
		this.buffer = null;
		this.loop = false;
		this.volume = 1;
		this.pitch = 1;
		this.refCount = 0;
		this.ready = false;
		this.onReady = callback;

		this.load(url);
	}

	onLoad() {
		this.ready = true;
		if (this.onReady) this.onReady(this);
	}

	play(time) {
		if (this.ready) {
			var sourceNode = this.context.createBufferSource();
			sourceNode.buffer = this.buffer;
			sourceNode.playbackRate.value = this.pitch;
			sourceNode.loop = this.loop;

			var gainNode = this.context.createGain();
			gainNode.gain.value = this.volume;

			sourceNode.connect(gainNode);
			gainNode.connect(this.context.destination);

			sourceNode.start(0);
		} else {
			console.warn("Attempted to play audio before loading...");
		}
	}

	load(url) {
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "arraybuffer";

		var _this = this;

		request.onload = function () {
			_this.context.decodeAudioData(request.response, function (buffer) {
				if (!buffer) {
					alert("Failed to decode " + url + ": Received no data!");
					return;
				}

				_this.buffer = buffer;
				_this.onLoad();
			}, function (error) {
				console.error("decodeAudioData Error:", error);
			});
		};

		request.onerror = function () {
			console.warn("Failed to load " + url + ": XHR error!");
		};

		request.send();
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Sound);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = getRandomInt;
/* harmony export (immutable) */ __webpack_exports__["c"] = getRandomFloat;
/* unused harmony export zerofill */
/* harmony export (immutable) */ __webpack_exports__["b"] = mergeObjects;
/* harmony export (immutable) */ __webpack_exports__["a"] = iterateProperties;
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function zerofill(num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
}

function mergeObjects() {
	var ret = {};
	for (var i = 0; i < arguments.length; i++) {
		var obj = arguments[i];
		for (var property in obj) {
			ret[property] = obj[property];
		}
	}
	return ret;
}

function iterateProperties(object, func) {
	for (var property in object) {
		if (object.hasOwnProperty(property)) {
			func(object[property]);
		}
	}
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Map_js__ = __webpack_require__(0);


let loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;

class Building {
	constructor() {
		this.model = null;
		this.riser = null;
		this.scene = null;
		this.x = 0;
		this.y = 0;
		this.z = 0;

		var that = this;
		loader.load('models/teleport-pad.dae', function (model) {
			that.model = model.scene;
			that.model.rotation.set(0, 1.57, 0);
			that.model.position.set(that.x + 0.5, that.y + 0.05, that.z + 0.5);
			that.scene.add(that.model);
		});
		loader.load('models/riser.dae', function (model) {
			console.log('Loaded model ' + model.name);
			that.riser = model.scene;
			that.riser.rotation.set(0, 1.57, 0);
			that.riser.position.set(that.x + 0.5, that.y + 0.05, that.z + 0.5);
			that.scene.add(that.riser);
		});
	}

	setX(x) {
		this.x = x;
		if (this.model) this.model.position.setX(x + 0.5);
	}

	setY(y) {
		this.y = y;
		if (this.model) this.model.position.setY(y + 0.1);
	}

	setZ(z) {
		this.z = z;
		if (this.model) this.model.position.setZ(z + 0.5);
	}

	setPosition(x, y, z) {
		this.setX(x);
		this.setY(y);
		this.setZ(z);
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Building);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Soundscape_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__IceCavernSoundscape_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Map_js__ = __webpack_require__(0);




class World {
	constructor() {
		this.scene = new THREE.Scene();
		this.soundscape = new __WEBPACK_IMPORTED_MODULE_0__Soundscape_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__IceCavernSoundscape_js__["a" /* default */]);
		this.map = new __WEBPACK_IMPORTED_MODULE_2__Map_js__["a" /* default */]();

		// Create ambient light
		this.ambientLight = new THREE.AmbientLight(0x0A0A0A);
		//this.ambientLight = new THREE.AmbientLight( 0xFFFFFF );
		this.scene.add(this.ambientLight);
	}

	loadMap(mapName, callback) {
		this.map.load(mapName, this.scene, callback);
	}
}

/* harmony default export */ __webpack_exports__["a"] = (World);

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
	"name": "Ice Cavern",
	"playlooping": {
		"volume": 0.6,
		"pitch": 1.0,
		"sound": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/281114/Iambloop.wav"
	},
	"playrandom": {
		"time": [10, 30],
		"volume": [0.4, 1],
		"pitch": [0.9, 1.05],
		"random": ["https://s3-us-west-2.amazonaws.com/s.cdpn.io/281114/Iceamb1.wav", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/281114/iceamb2.wav", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/281114/iceamb3.wav"]
	}
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Sound_js__ = __webpack_require__(1);


let instance = null;
class SoundManager {
	constructor() {
		if (!instance) {
			instance = this;

			var audioContext = window.AudioContext || window.webkitAudioContext;
			this.context = new audioContext();
			this.sounds = {};
		}

		return instance;
	}

	load(url, callback) {
		this.sounds[url] = new __WEBPACK_IMPORTED_MODULE_0__Sound_js__["a" /* default */](url, this.context, callback);
		return this.sounds[url];
	}

	getSound(url, callback) {
		var sound = null;
		if (this.sounds.hasOwnProperty(url)) {
			sound = this.sounds[url];
			callback(sound);
		} else {
			sound = this.load(url, callback);
		}
		sound.refCount++;
		return sound;
	}
}

/* harmony default export */ __webpack_exports__["a"] = (SoundManager);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Sound_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SoundManager_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Utility__ = __webpack_require__(2);




class Soundscape {
	constructor(json) {
		this.rules = json;
		this.name = this.rules.name || "Soundscape";
		this.sm = new __WEBPACK_IMPORTED_MODULE_1__SoundManager_js__["a" /* default */]();
		this.looping = null;
		this.random = [];

		var _this = this;

		if (this.rules.hasOwnProperty("playlooping")) {
			var playlooping = this.rules.playlooping;
			this.looping = this.sm.getSound(playlooping.sound, function (sound) {
				sound.volume = playlooping.volume;
				sound.pitch = playlooping.pitch;
				sound.loop = true;
				sound.play();
			});
		}

		if (this.rules.hasOwnProperty("playrandom")) {
			var playrandom = this.rules.playrandom;
			for (var url of playrandom.random) {
				this.random.push(this.sm.getSound(url));
			}
			setTimeout(function () {
				_this.playRandom();
			}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Utility__["c" /* getRandomFloat */])(playrandom.time[0], playrandom.time[playrandom.time.length - 1]) * 1000);
		}
	}

	playRandom() {
		var playrandom = this.rules.playrandom;
		var index = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Utility__["d" /* getRandomInt */])(0, this.random.length - 1);
		var sound = this.random[index];

		sound.volume = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Utility__["c" /* getRandomFloat */])(playrandom.volume[0], playrandom.volume[playrandom.volume.length - 1]);
		sound.pitch = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Utility__["c" /* getRandomFloat */])(playrandom.pitch[0], playrandom.pitch[playrandom.pitch.length - 1]);
		sound.play();

		var _this = this;
		setTimeout(function () {
			_this.playRandom();
		}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Utility__["c" /* getRandomFloat */])(playrandom.time[0], playrandom.time[playrandom.time.length - 1]) * 1000);
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Soundscape);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Path to images
var kImagePath = 'images/';

// Singleton TextureManager Class
let instance = null;
class TextureManager {
	constructor() {
		if (!instance) {
			instance = this;

			this.loaded = {};
		}

		return instance;
	}
	load(filename) {
		if (this.loaded.hasOwnProperty(filename)) return this.loaded[filename];

		this.loaded[filename] = new THREE.ImageUtils.loadTexture(kImagePath + filename);
		this.loaded[filename].flipY = false;

		return this.loaded[filename];
	}
}

/* harmony default export */ __webpack_exports__["a"] = (TextureManager);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__TextureManager_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utility_js__ = __webpack_require__(2);



// CONSTANTS
var HEIGHT_MULTIPLER = 0.05;

// SURF TYPES
var SURF = {
	GROUND: 0,
	SOLID_ROCK: 1,
	HARD_ROCK: 2,
	LOOSE_ROCK: 3,
	DIRT: 4,
	SOIL: 5,
	LAVA: 6,
	ORE_SEAM: 8,
	WATER: 9,
	CRYSTAL_SEAM: 10,
	RECHARGE_SEAM: 11
};

class Tile {
	constructor(parent, x, y) {
		this.tm = new __WEBPACK_IMPORTED_MODULE_0__TextureManager_js__["a" /* default */]();
		this.parent = parent;
		this.x = x;
		this.y = y;

		this.geometry = null;
		this.texture = null;
		this.mesh = null;

		this.surf = 1;
		this.high = 0;
		this.undiscovered = false;

		this.health = -1;
	}

	isSolid() {
		return this.surf !== SURF.GROUND && this.surf !== SURF.WATER && this.surf !== SURF.LAVA || this.undiscovered;
	}

	explore() {
		if (this.undiscovered) {
			this.undiscovered = false;
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Utility_js__["a" /* iterateProperties */])(this.getAllNeighbors(), function (neighbor) {
				neighbor.update();
			});
		}
	}

	collapse() {
		if (this.isSolid()) {
			this.surf = SURF.GROUND;
			this.update();
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Utility_js__["a" /* iterateProperties */])(this.getAllNeighbors(), function (neighbor) {
				neighbor.update();
			});
		}
	}

	getY(x, z) {
		var raycaster = new THREE.Raycaster();
		raycaster.set(new THREE.Vector3(x, 3, z), new THREE.Vector3(0, -1, 0));
		var intersect = raycaster.intersectObjects(this.mesh.children, true);

		return intersect[0].point.y;
	}

	getNeighbors() {
		return {
			"top": this.parent.getTile(this.x, this.y - 1),
			"right": this.parent.getTile(this.x + 1, this.y),
			"bottom": this.parent.getTile(this.x, this.y + 1),
			"left": this.parent.getTile(this.x - 1, this.y)
		};
	}

	getDiagonalNeighbors() {
		return {
			"topLeft": this.parent.getTile(this.x - 1, this.y - 1),
			"topRight": this.parent.getTile(this.x + 1, this.y - 1),
			"bottomRight": this.parent.getTile(this.x + 1, this.y + 1),
			"bottomLeft": this.parent.getTile(this.x - 1, this.y + 1)
		};
	}

	getAllNeighbors() {
		return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Utility_js__["b" /* mergeObjects */])(this.getNeighbors(), this.getDiagonalNeighbors());
	}

	update() {
		var n = this.getAllNeighbors();

		var isSurrounded = true;
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Utility_js__["a" /* iterateProperties */])(n, function (neighbor) {
			isSurrounded = isSurrounded && neighbor.isSolid();
		});

		if (isSurrounded) {
			this.undiscovered = true;
		} else {
			this.explore();
		}

		var topLeftVertex = new THREE.Vector3(this.x, 0, this.y);
		var topRightVertex = new THREE.Vector3(this.x + 1, 0, this.y);
		var bottomLeftVertex = new THREE.Vector3(this.x, 0, this.y + 1);
		var bottomRightVertex = new THREE.Vector3(this.x + 1, 0, this.y + 1);

		if (this.isSolid()) {
			if (n.topLeft.isSolid() && n.top.isSolid() && n.left.isSolid()) {
				topLeftVertex.y = 1;
			}

			if (n.topRight.isSolid() && n.top.isSolid() && n.right.isSolid()) {
				topRightVertex.y = 1;
			}

			if (n.bottomRight.isSolid() && n.bottom.isSolid() && n.right.isSolid()) {
				bottomRightVertex.y = 1;
			}

			if (n.bottomLeft.isSolid() && n.bottom.isSolid() && n.left.isSolid()) {
				bottomLeftVertex.y = 1;
			}
		}

		// WALL-TYPES
		// 1: CORNER
		// 2: WEIRD-CREVICE or FLAT-WALL
		// 3: INVERTED-CORNER

		var wallType = topLeftVertex.y + topRightVertex.y + bottomRightVertex.y + bottomLeftVertex.y;
		if (wallType === 0) this.surf = SURF.GROUND;
		var uvOffset = 0;

		// not-rotated
		// 1 ?
		// ? 0
		if (topLeftVertex.y && !bottomRightVertex.y && (wallType == 3 || wallType == 2 == Boolean(topRightVertex.y))) {
			uvOffset = 0;
		}

		// 90 clock-wise
		// ? 1
		// 0 ?
		if (topRightVertex.y && !bottomLeftVertex.y && (wallType == 3 || wallType == 2 == Boolean(bottomRightVertex.y))) {
			uvOffset = 3;
		}

		// 180 clock-wise
		// 0 ?
		// ? 1
		if (bottomRightVertex.y && !topLeftVertex.y && (wallType == 3 || wallType == 2 == Boolean(bottomLeftVertex.y))) {
			uvOffset = 2;
		}

		// 270 clock-wise
		// ? 0
		// 1 ?
		if (bottomLeftVertex.y && !topRightVertex.y && (wallType == 3 || wallType == 2 == Boolean(topLeftVertex.y))) {
			uvOffset = 1;
		}

		if (wallType == 2) {
			if (topLeftVertex.y && bottomRightVertex.y) {
				uvOffset = 0;
			}
			if (topRightVertex.y && bottomLeftVertex.y) {
				uvOffset = 3;
			}
		}

		var textureName = this.parent.biome + "/";
		var textureIndex = -1;

		if (this.undiscovered) {
			textureName += "70.bmp";
		} else {
			if (wallType == 1) {
				textureIndex = 2;
			} else if (wallType == 3) {
				textureIndex = 1;
			} else if (wallType == 2 && topLeftVertex.y == bottomRightVertex.y) {
				textureName += "77.bmp";
			} else {
				textureIndex = 0;
			}
		}

		if (textureIndex != -1) textureName += this.parent.tileTypes[this.surf].textures[textureIndex];
		this.texture = this.tm.load(textureName);

		/*
  //		0---1                1         0---1
  //		|   |  becomes      /|   and   |  /
  //		|   |             /  |         |/
  //		3---2            3---2         3
  //
  //		OR
  //
  //		0---1            0             0---1
  //		|   |  becomes   |\    	 and    \  |
  //		|   |            |  \             \|
  //		3---2            3---2             2
  //
  //		Triangles 0-1-3 and 0-3-2
  //		Quad 0-1-3-2
  */

		this.parent.group.remove(this.mesh);
		if (this.geometry) this.geometry.dispose();
		this.geometry = new THREE.Geometry();

		this.geometry.vertices.push(topLeftVertex, topRightVertex, bottomRightVertex, bottomLeftVertex);

		var uv = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)];

		if (topRightVertex.y !== bottomLeftVertex.y || wallType == 2 && !(topRightVertex.y && bottomLeftVertex.y)) {
			this.geometry.faceVertexUvs[0].push([uv[(1 + uvOffset) % 4], uv[(3 + uvOffset) % 4], uv[(2 + uvOffset) % 4]]);

			this.geometry.faceVertexUvs[0].push([uv[(1 + uvOffset) % 4], uv[(0 + uvOffset) % 4], uv[(3 + uvOffset) % 4]]);

			this.geometry.faces.push(new THREE.Face3(1, 3, 2), new THREE.Face3(1, 0, 3));
		} else {
			this.geometry.faceVertexUvs[0].push([uv[(0 + uvOffset) % 4], uv[(3 + uvOffset) % 4], uv[(2 + uvOffset) % 4]]);

			this.geometry.faceVertexUvs[0].push([uv[(0 + uvOffset) % 4], uv[(2 + uvOffset) % 4], uv[(1 + uvOffset) % 4]]);

			this.geometry.faces.push(new THREE.Face3(0, 3, 2), new THREE.Face3(0, 2, 1));
		}

		topLeftVertex.y = topLeftVertex.y * 1.0 + this.high * HEIGHT_MULTIPLER;
		topRightVertex.y = topRightVertex.y * 1.0 + n.right.high * HEIGHT_MULTIPLER;
		bottomRightVertex.y = bottomRightVertex.y * 1.0 + n.bottomRight.high * HEIGHT_MULTIPLER;
		bottomLeftVertex.y = bottomLeftVertex.y * 1.0 + n.bottom.high * HEIGHT_MULTIPLER;

		this.geometry.computeFaceNormals();
		this.geometry.computeVertexNormals();

		this.mesh = new THREE.SceneUtils.createMultiMaterialObject(this.geometry, [new THREE.MeshPhongMaterial({ map: this.texture, shininess: 0 })]);

		this.mesh.userData = { parent: this };
		this.parent.group.add(this.mesh);
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Tile);

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__World_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Building_js__ = __webpack_require__(3);
// Ensure Webpack compiles sass...
__webpack_require__(5);




const DEFAULT_FOV = 90;

// THREE
let camera, controls, renderer;
const loader = new THREE.ColladaLoader();

// STATS
let stats;

// RAIDERS
let world;
let light;
let teleportPad;
const mouse = new THREE.Vector2();
const mouse3D = new THREE.Vector3();

let timeSinceMouseMove;
let hoveredObject;
let selectedObject;

let isMouseDown = false;
const mouseDownPosition = new THREE.Vector2();

init();
animate();

function initStats() {
  stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms

  // align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild(stats.domElement);
}

function init() {
  console.log('Hello!');
  camera = new THREE.PerspectiveCamera(DEFAULT_FOV, window.innerWidth / window.innerHeight, 0.0001, 1000);
  controls = new THREE.OrbitControls(camera);

  renderer = new THREE.WebGLRenderer({ antialiasing: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  initStats();

  world = new __WEBPACK_IMPORTED_MODULE_0__World_js__["a" /* default */]();
  world.loadMap('./maps/Level05.json', () => {
    const targetX = world.map.getWidth() / 2 + 1;
    const targetY = world.map.getHeight() / 2 - 2;

    camera.position.set(targetX - 2, 3, targetY + 2);
    controls.target.set(targetX, 0, targetY);

    teleportPad = new __WEBPACK_IMPORTED_MODULE_1__Building_js__["a" /* default */]();
    teleportPad.scene = world.scene;
    teleportPad.setX(14);
    teleportPad.setZ(10);
    const y = world.map.getY(14.5, 10.5);
    teleportPad.setY(y + 0.1);
  });

  light = new THREE.PointLight(0xffffff, 1, 7);
  light.position.set(12.5, 3, 12.5);
  world.scene.add(light);
  world.scene.fog = new THREE.FogExp2(0x6e6e9b, 0.05);

  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('mousedown', onMouseDown, false);
  window.addEventListener('mouseup', onMouseUp, false);

  window.addEventListener('keydown', onKeyDown, false);
}

function animate() {
  stats.begin();

  light.position.set(mouse3D.x, mouse3D.y + 3, mouse3D.z);
  controls.update();
  renderer.render(world.scene, camera);
  stats.end();

  requestAnimationFrame(animate);
}

function onMouseDown() {
  isMouseDown = true;
}

function onMouseUp() {
  isMouseDown = false;
  if (selectedObject !== undefined) {
    selectedObject.mesh.children[0].material.color.setHex(0xffffff);
  }

  selectedObject = getIntersectObject();

  if (selectedObject !== undefined) {
    selectedObject.mesh.children[0].material.color.setHex(0x7f00ff);
  }
}

function getIntersectObject() {
  return getIntersect().object.parent.userData.parent;
}

function getIntersect() {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(world.map.group.children, true);

  if (intersects.length > 0) {
    return intersects[0];
  }
  return null;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouse.x = event.clientX / window.innerWidth * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  clearTimeout(timeSinceMouseMove);

  const intersect = getIntersect();

  if (intersect !== null) {
    if (!isMouseDown) {
      mouse3D.x = intersect.point.x;
      mouse3D.y = intersect.point.y;
      mouse3D.z = intersect.point.z;
    }
    timeSinceMouseMove = setTimeout(() => {
      hoveredObject = intersect.object.parent.userData.parent;
    }, 500);
  }
}

function onKeyDown(event) {
  const keycode = event.keyCode ? event.keyCode : event.charCode;

  switch (keycode) {
    case 67:
      {
        if (selectedObject) {
          selectedObject.collapse();
        }
        break;
      }

    default:
      {
        break;
      }
  }
}

/***/ })
/******/ ]);