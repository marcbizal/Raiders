var THREE = require("three.js");
var Map = require("./Map.js");

function World()
{
	this.scene = new THREE.Scene();
	this.map = new Map();

	// Create ambient light
	this.ambientLight = new THREE.AmbientLight( 0x0A0A0A );
	//this.ambientLight = new THREE.AmbientLight( 0xFFFFFF );
	this.scene.add( this.ambientLight );
}

World.prototype = {};
World.prototype.loadMap = function(mapName, callback)
{
	this.map.load(mapName, this.scene, callback);
}
World.prototype.constructor = World;

module.exports = World;
