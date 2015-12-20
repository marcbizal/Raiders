import Sound from "./Sound.js";
import SoundManager from "./SoundManager.js";
import { getRandomInt, getRandomFloat } from "./Utility";

class Soundscape {
	constructor(json) {
		this.rules = json;
		this.name = this.rules.name || "Soundscape";
		this.sm = new SoundManager();
		this.looping = null;
		this.random = [];

		var _this = this;

		if (this.rules.hasOwnProperty("playlooping")) {
			var playlooping = this.rules.playlooping;
			this.looping = this.sm.getSound(playlooping.sound, function(sound) {
				sound.volume = playlooping.volume;
				sound.pitch = playlooping.pitch;
				sound.loop = true;
				sound.play();
			});
		}

		if (this.rules.hasOwnProperty("playrandom")) {
			var playrandom = this.rules.playrandom;
			for (var url of playrandom.random)
			{
				this.random.push(this.sm.getSound(url));
			}
			setTimeout(function() { _this.playRandom(); }, getRandomFloat(playrandom.time[0], playrandom.time[playrandom.time.length-1]) * 1000);
		}
	}

	playRandom() {
		var playrandom = this.rules.playrandom;
		var index = getRandomInt(0, this.random.length-1);
		var sound = this.random[index];

		sound.volume = getRandomFloat(playrandom.volume[0], playrandom.volume[playrandom.volume.length-1]);
		sound.pitch = getRandomFloat(playrandom.pitch[0], playrandom.pitch[playrandom.pitch.length-1]);
		sound.play();

		var _this = this;
		setTimeout(function() { _this.playRandom(); }, getRandomFloat(playrandom.time[0], playrandom.time[playrandom.time.length-1]) * 1000);
	}
}

export default Soundscape;
