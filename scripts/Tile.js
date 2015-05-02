define(function() {

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

	function Tile(parent, x, y, surf)
	{
		this.parent = parent;
		this.x = x;
		this.y = y;

		this.geometry = new THREE.Geometry();
		this.texture = new THREE.Texture();
		this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true} ));

		this.surf = surf;
		this.height = 0;
		this.undiscovered = false;
	}

	Tile.prototype = {};
	Tile.prototype.constructor = Tile;
	Tile.prototype.addToScene = function(scene)
	{
		scene.add(this.mesh);
	}

	Tile.prototype.isSolid = function()
	{
		return ((this.surf !== SURF.GROUND) && 
				(this.surf !== SURF.WATER) && 
				(this.surf !== SURF.LAVA) && 
				(this.surf !== SURF.RUBBLE)) ||
				(this.undiscovered);
	}

	Tile.prototype.update = function()
	{
		var textureName = 'images/';

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


		if (this.undiscovered)
		{
			textureName += 'ROCKROOF';
		}
		else
		{
			textureName += "rock/";
			
			if (wallType == 1)
			{
				textureName += "corner/";
			}

			if (wallType == 3)
			{
				textureName += "inverted/"
			}

			if (wallType == 2 && (topLeftVertex.y == bottomRightVertex.y))
			{
				textureName += '12';
			}
			else
			{
				textureName += pad(this.surf, 2);
			}
		}
		textureName += '.png';

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

		this.geometry.dispose();
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

		topLeftVertex.y = (topLeftVertex.y*1.2)+(this.height*HEIGHT_MULTIPLER);
		topRightVertex.y = (topRightVertex.y*1.2)+(right.height*HEIGHT_MULTIPLER);
		bottomRightVertex.y = (bottomRightVertex.y*1.2)+(bottomRight.height*HEIGHT_MULTIPLER);
		bottomLeftVertex.y = (bottomLeftVertex.y*1.2)+(bottom.height*HEIGHT_MULTIPLER);

		this.geometry.computeFaceNormals();	
		this.geometry.computeVertexNormals();

		this.texture = new THREE.ImageUtils.loadTexture(textureName);
		this.texture.minFilter = THREE.NearestFilter;
		this.texture.flipY = false;

		this.mesh = THREE.SceneUtils.createMultiMaterialObject(this.geometry, [
    		new THREE.MeshPhongMaterial( { map: this.texture, shininess: 0 } ),
    		//new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true} )
		]);
	}

	return Tile;
});