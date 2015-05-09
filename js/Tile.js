define(['TextureManager'], function(TextureManager) {

	var TextureManager = TextureManager.getTextureManager();
	function pad(num, size) {
    	var s = num+"";
    	while (s.length < size) s = "0" + s;
    	return s;
	}

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
	}

	function Tile(parent, x, y)
	{
		this.parent = parent;
		this.x = x;
		this.y = y;

		this.geometry = null;
		this.texture = null;
		this.mesh = null;
		
		this.surf = 0;
		this.height = 0;
		this.undiscovered = false;

		this.health = -1;
	}

	Tile.prototype = {};
	Tile.prototype.constructor = Tile;
	Tile.prototype.isSolid = function()
	{
		return ((this.surf !== SURF.GROUND) && 
				(this.surf !== SURF.WATER) && 
				(this.surf !== SURF.LAVA) && 
				(this.surf !== SURF.RUBBLE)) ||
				(this.undiscovered);
	}
	Tile.prototype.getY = function(x, z)
	{
		var raycaster = new THREE.Raycaster();
		raycaster.set(new THREE.Vector3(x, 3, z), new THREE.Vector3(0, -1, 0));
		var intersect = raycaster.intersectObjects(this.mesh.children, true);

		return intersect[0].point.y;
	}

	Tile.prototype.update = function()
	{
		var topLeft = this.parent.getTile(this.x-1, this.y-1);
		var top = this.parent.getTile(this.x, this.y-1);
		var topRight = this.parent.getTile(this.x+1, this.y-1);
		var right = this.parent.getTile(this.x+1, this.y);
		var bottomRight = this.parent.getTile(this.x+1, this.y+1);
		var bottom = this.parent.getTile(this.x, this.y+1);
		var bottomLeft = this.parent.getTile(this.x-1, this.y+1);
		var left = this.parent.getTile(this.x-1, this.y);

		if (topLeft.isSolid() &&
			top.isSolid() &&
			topRight.isSolid() &&
			right.isSolid() &&
			bottomRight.isSolid() &&
			bottom.isSolid() &&
			bottomLeft.isSolid() &&
			left.isSolid())
		{
			this.undiscovered = true;
		}

		var topLeftVertex = new THREE.Vector3(this.x, 0, this.y);
		var topRightVertex = new THREE.Vector3(this.x+1, 0, this.y);
		var bottomLeftVertex = new THREE.Vector3(this.x, 0, this.y+1);
		var bottomRightVertex = new THREE.Vector3(this.x+1, 0, this.y+1);

		if (this.isSolid())
		{
			if (topLeft.isSolid() && (top.isSolid() && left.isSolid()))
			{
				topLeftVertex.y = 1;
			}

			if (topRight.isSolid() && (top.isSolid() && right.isSolid()))
			{
				topRightVertex.y = 1;
			}

			if (bottomRight.isSolid() && (bottom.isSolid() && right.isSolid()))
			{
				bottomRightVertex.y = 1;
			}

			if (bottomLeft.isSolid() && (bottom.isSolid() && left.isSolid()))
			{
				bottomLeftVertex.y = 1;
			}
		}

		// WALL-TYPES
		// 1: CORNER
		// 2: WEIRD-CREVICE or FLAT-WALL
		// 3: INVERTED-CORNER

		var wallType = topLeftVertex.y + topRightVertex.y + bottomRightVertex.y + bottomLeftVertex.y;
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

		var textureName = this.parent.biome + '/';
		var textureIndex = -1;

		if (this.undiscovered)
		{
			textureName += '70.bmp';
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
		this.texture = TextureManager.load(textureName);

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

		topLeftVertex.y = (topLeftVertex.y*1.0)+(this.height*HEIGHT_MULTIPLER);
		topRightVertex.y = (topRightVertex.y*1.0)+(right.height*HEIGHT_MULTIPLER);
		bottomRightVertex.y = (bottomRightVertex.y*1.0)+(bottomRight.height*HEIGHT_MULTIPLER);
		bottomLeftVertex.y = (bottomLeftVertex.y*1.0)+(bottom.height*HEIGHT_MULTIPLER);

		this.geometry.computeFaceNormals();	
		this.geometry.computeVertexNormals();

		this.mesh = new THREE.SceneUtils.createMultiMaterialObject(this.geometry, [
    		new THREE.MeshPhongMaterial( { map: this.texture, shininess: 0 } ),
    		//new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true} )
		]);

		this.mesh.userData = { parent: this };
	}

	return Tile;
});