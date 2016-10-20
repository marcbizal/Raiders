import Soundscape from "./Soundscape.js";
import IceCavernSoundscape from "./IceCavernSoundscape.js";
import Map from "./Map.js";

class World {
	constructor() {
		this.scene = new THREE.Scene();
		this.soundscape = new Soundscape(IceCavernSoundscape);
		this.map = new Map();

		// Create ambient light
		this.ambientLight = new THREE.AmbientLight( 0x0A0A0A );
		//this.ambientLight = new THREE.AmbientLight( 0xFFFFFF );
		this.scene.add( this.ambientLight );
	}

	loadMap(mapName, callback)
	{
		this.map.load(mapName, this.scene, callback);
	}
}

export default World;
