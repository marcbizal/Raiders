define(function () {
    'use strict';

    var kImagePath = 'images/';
    var TextureManager = {
    	loaded: {},
    	load: function(filename)
    	{
    		if (this.loaded.hasOwnProperty(filename)) return this.loaded[filename];

    		this.loaded[filename] = new THREE.ImageUtils.loadTexture(kImagePath + filename);
			this.loaded[filename].flipY = false;

			return this.loaded[filename];
    	}
    }

    return {
        getTextureManager: function () { return TextureManager; }
    };
});