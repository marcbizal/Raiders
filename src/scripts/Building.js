import Map from "./Map.js";

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
		loader.load('models/teleport-pad.dae', function(model) {
			that.model = model.scene;
			that.model.rotation.set(0, 1.57, 0);
			that.model.position.set(that.x+0.5, that.y+0.05, that.z+0.5);
			that.scene.add(that.model);
		});
		loader.load('models/riser.dae', function(model) {
			console.log('Loaded model ' + model.name);
			that.riser = model.scene;
			that.riser.rotation.set(0, 1.57, 0);
			that.riser.position.set(that.x+0.5, that.y+0.05, that.z+0.5);
			that.scene.add(that.riser);
		});
	}

	setX(x) {
		this.x = x;
		if (this.model) this.model.position.setX(x+0.5);
	}

	setY(y) {
		this.y = y;
		if (this.model) this.model.position.setY(y+0.1);
	}

	setZ(z) {
		this.z = z;
		if (this.model) this.model.position.setZ(z+0.5);
	}

	setPosition(x, y, z) {
		this.setX(x);
		this.setY(y);
		this.setZ(z);
	}
}

export default Building;
