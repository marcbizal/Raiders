import Tile from "./Tile.js";
var kTileTypesFile = './config/TileTypes.json';

class Map {
	constructor()
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

	getWidth()
	{
		return this.width;
	}

	getHeight()
	{
		return this.height;
	}

	getTileType(index)
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

	getY(x, z)
	{
		return this.getTile(Math.floor(x), Math.floor(z)).getY(x, z);
	}

	updateRect(top, left, width, height)
	{
		for (var y = top; y < height; y++)
		{
			for (var x = left; x < width; x++)
			{
				this.tile[y][x].update();
			}
		}
	}

	loadTileTypes(json)
	{
		var xhr = new XMLHttpRequest();

		var that = this;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				that.tileTypes = JSON.parse(xhr.responseText);
			}
		};

		xhr.open('GET', kTileTypesFile, true);
		xhr.send();
	}

	load(filename, scene, callback)
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

				for (let y = 0; y < data.height; y++)
				{
					that.tile.push([]);
					for (let x = 0; x < data.width; x++)
					{
						// Set surf
						that.tile[y].push(new Tile(that, x, y));
						that.tile[y][x].surf = data.surf[y][x];
						that.tile[y][x].high = data.high[y][x];

						// Set undiscovered flag
						if (data.dugg[y][x] == 2)
						{
							that.tile[y][x].undiscovered = true;
						}
					}
				}

				for (let y = 0; y < data.height; y++)
				{
					for (let x = 0; x < data.width; x++)
					{
						that.tile[y][x].update();
						//that.group.add(that.tile[y][x].mesh);
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

	getTile(x, y)
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
}

export default Map;
