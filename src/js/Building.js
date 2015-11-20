define(['Map'], function(Map) {
	'use strict';

	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	function Building()
	{
		this.model = null;
		this.riser = null;
		this.scene = null;
		this.x = 0;
		this.y = 0;
		this.z = 0;

		var that = this;
		loader.load('models/teleport-pad.dae', function (model) {
			that.model = model.scene;
			//that.model.rotation.set(0, 1.57, 0);
			that.model.position.set(that.x+0.5, that.y+0.1, that.z+0.5);
			that.scene.add(that.model);
		});
		loader.load('models/riser.dae', function (model) {
			console.log('Loaded model ' + model.name);
			that.riser = model.scene;
			//that.riser.rotation.set(0, 1.57, 0);
			that.riser.position.set(that.x+0.5, that.y+0.1, that.z+0.5);
			that.scene.add(that.riser);
		});
	}

	Building.prototype = {};
	Building.prototype.constructor = Building;
	Building.prototype.setX = function(x) {
		this.x = x;
		if (this.model) this.model.position.setX(x+0.5);
	};
	Building.prototype.setY = function(y) {
		this.y = y;
		if (this.model) this.model.position.setY(y+0.1);
	};
	Building.prototype.setZ = function(z) {
		this.z = z;
		if (this.model) this.model.position.setZ(z+0.5);
	}
	Building.prototype.setPosition = function(x, y, z) {
		this.setX(x);
		this.setY(y);
		this.setZ(z);
	};

	return Building;
});