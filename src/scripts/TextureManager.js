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

export default TextureManager;
