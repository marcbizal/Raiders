import Sound from "./Sound.js";

let instance = null;
class SoundManager {
	constructor() {
        if (!instance) {
            instance = this;

            var audioContext = (window.AudioContext || window.webkitAudioContext);
            this.context = new audioContext();
            this.sounds = {};
        }

        return instance;
	}

	load(url, callback) {
		this.sounds[url] = new Sound(url, this.context, callback);
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

export default SoundManager;
