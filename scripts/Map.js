define(['Tile', 'require'], function(Tile, require) {
	'use strict';
	function Map()
	{
		this.name = name;
		this.width = 0;
		this.height = 0;
		this.tile = new Array();
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
	Map.prototype.load = function(filename, scene, callback)
	{
		var that = this;
		require([filename], function(map) {
			that.name = map.name;
			that.width = map.width;
			that.height = map.height;

			for (var y = 0; y < map.height; y++)
			{
				that.tile.push(new Array());
				for (var x = 0; x < map.width; x++)
				{
					// Set surf
					that.tile[y].push(new Tile(that, x, y, map.surf[y][x])); 
					that.tile[y][x].height = map.high[y][x];

					// Set undiscovered flag
					if (map.dugg[y][x] == 2)
					{
						that.tile[y][x].undiscovered = true;
					}
				}		
			}

			for (var y = 0; y < map.height; y++)
			{
				for (var x = 0; x < map.width; x++)
				{
					that.tile[y][x].update();
					that.group.add(that.tile[y][x].mesh);
				}		
			}

			callback();
		});

		scene.add(this.group);
		console.dir(this);
	}
	Map.prototype.getTile = function(x, y)
	{
		if ((x >= this.width || x < 0) || (y >= this.height || y < 0)) 
		{
			// Return an out-of-bounds tile
			return new Tile(null, x, y, 1);
		}
		else
		{
			// Return the actual tile
			return this.tile[y][x];
		}
	}

	return Map;
});