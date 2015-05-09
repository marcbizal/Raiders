define(['Tile', 'require'], function(Tile, require) {
	'use strict';

	var kTileTypesFile = './js/TileTypes.json';

	function Map()
	{
		this.name = "";
		this.width = 0;
		this.height = 0;
		this.biome = "rock";

		// Load tile types
		this.tileTypes = null;
		this.loadTileTypes();

		this.tile = [];
		this.group = new THREE.Group();
	}

	Map.prototype = {};
	Map.prototype.constructor = Map;
	Map.prototype.getWidth = function()
	{
		return this.width;
	}

	Map.prototype.getHeight = function()
	{
		return this.height;
	}

	Map.prototype.getTileType = function(index)
	{
		if (tileTypes)
		{
			return tileTypes[index];
		}
		else
		{
			console.warn("getTileType() called before definitions were loaded.");
			return null;
		}
	}

	Map.prototype.getY = function(x, z)
	{
		return this.getTile(Math.floor(x), Math.floor(z)).getY(x, z);
	}

	Map.prototype.updateRect = function(top, left, width, height)
	{
		for (var y = top; y < height; y++)
		{
			for (var x = left; x < width; x++)
			{
				this.tile[y][x].update();
			}		
		}
	}

	Map.prototype.loadTileTypes = function(json)
	{
		var xhr = new XMLHttpRequest();

		var that = this;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				that.tileTypes = JSON.parse(xhr.responseText);
			}
		}

		xhr.open('GET', kTileTypesFile, true);
		xhr.send();
	}

	Map.prototype.load = function(filename, scene, callback)
	{
		var xhr = new XMLHttpRequest();

		var that = this;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				var data = JSON.parse(xhr.responseText);
				that.name = data.name;
				that.width = data.width;
				that.height = data.height;

				for (var y = 0; y < data.height; y++)
				{
					that.tile.push(new Array());
					for (var x = 0; x < data.width; x++)
					{
						// Set surf
						that.tile[y].push(new Tile(that, x, y)); 
						that.tile[y][x].surf = data.surf[y][x];
						that.tile[y][x].height = data.high[y][x];

						// Set undiscovered flag
						if (data.dugg[y][x] == 2)
						{
							that.tile[y][x].undiscovered = true;
						}
					}		
				}

				for (var y = 0; y < data.height; y++)
				{
					for (var x = 0; x < data.width; x++)
					{
						that.tile[y][x].update();
						that.group.add(that.tile[y][x].mesh);
					}		
				}

				callback();
			}
		};

		xhr.open('GET', filename, true);
		xhr.send();

		console.log(this);
		scene.add(this.group);
	}

	Map.prototype.getTile = function(x, y)
	{
		if ((x >= this.width || x < 0) || (y >= this.height || y < 0)) 
		{
			// Return an out-of-bounds tile
			return new Tile(null, x, y);
		}
		else
		{
			// Return the actual tile
			return this.tile[y][x];
		}
	}

	return Map;
});