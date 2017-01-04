import TextureManager from "./TextureManager.js";
import { mergeObjects, iterateProperties } from "./Utility.js";

// CONSTANTS
var HEIGHT_MULTIPLER = 0.05;

// SURF TYPES
var SURF = {
    GROUND: 		0,
    SOLID_ROCK: 	1,
    HARD_ROCK: 		2,
    LOOSE_ROCK: 	3,
    DIRT: 			4,
    SOIL:           5,
    LAVA: 			6,
    ORE_SEAM: 		8,
    WATER: 			9,
    CRYSTAL_SEAM: 	10,
    RECHARGE_SEAM: 	11
};

class Tile {
	constructor(parent, x, y) {
        this.tm = new TextureManager();
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
		return ((this.surf !== SURF.GROUND) &&
				(this.surf !== SURF.WATER) &&
				(this.surf !== SURF.LAVA)) ||
				(this.undiscovered);
	}

	explore() {
		if(this.undiscovered)
		{
			this.undiscovered = false;
			iterateProperties(this.getAllNeighbors(), function(neighbor) {
				neighbor.update();
			});
		}
	}

	collapse() {
		if(this.isSolid())
		{
			this.surf = SURF.GROUND;
			this.update();
			iterateProperties(this.getAllNeighbors(), function(neighbor) {
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
			"top": this.parent.getTile(this.x, this.y-1),
			"right": this.parent.getTile(this.x+1, this.y),
			"bottom": this.parent.getTile(this.x, this.y+1),
			"left": this.parent.getTile(this.x-1, this.y)
		};
	}

	getDiagonalNeighbors() {
		return {
			"topLeft": this.parent.getTile(this.x-1, this.y-1),
			"topRight": this.parent.getTile(this.x+1, this.y-1),
			"bottomRight": this.parent.getTile(this.x+1, this.y+1),
			"bottomLeft": this.parent.getTile(this.x-1, this.y+1)
		};
	}

	getAllNeighbors() {
		return mergeObjects(this.getNeighbors(), this.getDiagonalNeighbors());
	}

	update() {
		var n = this.getAllNeighbors();

		var isSurrounded = true;
		iterateProperties(n, function(neighbor) {
			isSurrounded = isSurrounded && neighbor.isSolid();
		});

		if (isSurrounded) {
			this.undiscovered = true;
		} else {
			this.explore();
		}

		var topLeftVertex = new THREE.Vector3(this.x, 0, this.y);
		var topRightVertex = new THREE.Vector3(this.x+1, 0, this.y);
		var bottomLeftVertex = new THREE.Vector3(this.x, 0, this.y+1);
		var bottomRightVertex = new THREE.Vector3(this.x+1, 0, this.y+1);

		if (this.isSolid())
		{
			if (n.topLeft.isSolid() && (n.top.isSolid() && n.left.isSolid()))
			{
				topLeftVertex.y = 1;
			}

			if (n.topRight.isSolid() && (n.top.isSolid() && n.right.isSolid()))
			{
				topRightVertex.y = 1;
			}

			if (n.bottomRight.isSolid() && (n.bottom.isSolid() && n.right.isSolid()))
			{
				bottomRightVertex.y = 1;
			}

			if (n.bottomLeft.isSolid() && (n.bottom.isSolid() && n.left.isSolid()))
			{
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
		if (topLeftVertex.y && !bottomRightVertex.y && (wallType == 3 || ((wallType == 2) == Boolean(topRightVertex.y))))
		{
			uvOffset = 0;
		}

		// 90 clock-wise
		// ? 1
		// 0 ?
		if (topRightVertex.y && !bottomLeftVertex.y && (wallType == 3 || ((wallType == 2) == Boolean(bottomRightVertex.y))))
		{
			uvOffset = 3;
		}

		// 180 clock-wise
		// 0 ?
		// ? 1
		if (bottomRightVertex.y && !topLeftVertex.y && (wallType == 3 || ((wallType == 2) == Boolean(bottomLeftVertex.y))))
		{
			uvOffset = 2;
		}

		// 270 clock-wise
		// ? 0
		// 1 ?
		if (bottomLeftVertex.y && !topRightVertex.y && (wallType == 3 || ((wallType == 2) == Boolean(topLeftVertex.y))))
		{
			uvOffset = 1;
		}

		if (wallType == 2)
		{
			if (topLeftVertex.y && bottomRightVertex.y)
			{
				uvOffset = 0;
			}
			if (topRightVertex.y && bottomLeftVertex.y)
			{
				uvOffset = 3;
			}
		}

		var textureName = this.parent.biome + "/";
		var textureIndex = -1;

		if (this.undiscovered)
		{
			textureName += "70.bmp";
		}
		else
		{
			if (wallType == 1)
			{
				textureIndex = 2;
			}
			else
			if (wallType == 3)
			{
				textureIndex = 1;
			}
			else
			if (wallType == 2 && (topLeftVertex.y == bottomRightVertex.y))
			{
				textureName += "77.bmp";
			}
			else
			{
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

		this.geometry.vertices.push(
			topLeftVertex,
			topRightVertex,
			bottomRightVertex,
			bottomLeftVertex
		);

		var uv = [
			new THREE.Vector2( 0, 0 ),
			new THREE.Vector2( 1, 0 ),
	    	new THREE.Vector2( 1, 1 ),
	    	new THREE.Vector2( 0, 1 )
		];

		if (topRightVertex.y !== bottomLeftVertex.y ||
			(wallType == 2 && !(topRightVertex.y && bottomLeftVertex.y)))
		{
			this.geometry.faceVertexUvs[0].push([
				uv[(1 + uvOffset) % 4],
				uv[(3 + uvOffset) % 4],
				uv[(2 + uvOffset) % 4]
	    	]);

			this.geometry.faceVertexUvs[0].push([
	        	uv[(1 + uvOffset) % 4],
				uv[(0 + uvOffset) % 4],
				uv[(3 + uvOffset) % 4]
	    	]);

			this.geometry.faces.push(
				new THREE.Face3(1, 3, 2),
				new THREE.Face3(1, 0, 3)
			);
		}
		else
		{
			this.geometry.faceVertexUvs[0].push([
				uv[(0 + uvOffset) % 4],
				uv[(3 + uvOffset) % 4],
				uv[(2 + uvOffset) % 4]
	    	]);

			this.geometry.faceVertexUvs[0].push([
	        	uv[(0 + uvOffset) % 4],
				uv[(2 + uvOffset) % 4],
				uv[(1 + uvOffset) % 4]
	    	]);

			this.geometry.faces.push(
				new THREE.Face3(0, 3, 2),
				new THREE.Face3(0, 2, 1)
			);
		}

		topLeftVertex.y = (topLeftVertex.y*1.0)+(this.high*HEIGHT_MULTIPLER);
		topRightVertex.y = (topRightVertex.y*1.0)+(n.right.high*HEIGHT_MULTIPLER);
		bottomRightVertex.y = (bottomRightVertex.y*1.0)+(n.bottomRight.high*HEIGHT_MULTIPLER);
		bottomLeftVertex.y = (bottomLeftVertex.y*1.0)+(n.bottom.high*HEIGHT_MULTIPLER);

		this.geometry.computeFaceNormals();
		this.geometry.computeVertexNormals();

		this.mesh = new THREE.SceneUtils.createMultiMaterialObject(this.geometry, [
			new THREE.MeshPhongMaterial( { map: this.texture, shininess: 0 } ),
			//new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true} )
		]);

		this.mesh.userData = { parent: this };
		this.parent.group.add(this.mesh);
	}
}

export default Tile;
