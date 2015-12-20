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

		request.onload = function() {
			_this.context.decodeAudioData(
				request.response,
				function(buffer) {
					if (!buffer) {
						alert("Failed to decode " + url + ": Received no data!");
						return;
					}

					_this.buffer = buffer;
					_this.onLoad();
				},
				function(error) {
					console.error("decodeAudioData Error:", error);
				}
			);
		};

		request.onerror = function() {
			console.warn("Failed to load " + url + ": XHR error!");
		};

		request.send();
	}
}

export default Sound;
