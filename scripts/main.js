require(['Map'], function (Map) {
	'use strict';

	var FOV = 90;

	var ROCK_FOG
	var LAVA_FOG
	var ICE_FOG

	function Game(mapFile) 
	{
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(FOV, window.innerWidth/window.innerHeight, 0.0001, 1000);
		this.focus = new THREE.Vector3( 12.5, 0, 12.5 );
		this.renderer = new THREE.WebGLRenderer({ antialiasing: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.stats = new Stats();
		this.stats.setMode(0); // 0: fps, 1: ms

		// align top-left
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.left = '0px';
		this.stats.domElement.style.top = '0px';

		document.body.appendChild( this.stats.domElement );	

		this.ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
		this.scene.add( this.ambientLight );

		this.light = new THREE.PointLight( 0xffffff, 1, 7 );
		this.light.position.set( 12.5, 3, 12.5 );
		this.scene.add( this.light );
		this.scene.fog = new THREE.FogExp2( 0x6e6e9b, 0.05 );

		this.map = new Map();
		this.map.load(mapFile, this.scene);

		document.body.appendChild( this.renderer.domElement );
	}

	Game.prototype.constructor = Game;
	Game.prototype.update = function() {
		this.stats.begin();

		// Update
		var that = this;
		var timer = new Date().getTime() * 0.0005;
		this.camera.position.y = 3;
		this.camera.position.x = 12.5 + Math.cos( timer ) * 5;
  		this.camera.position.z = 12.5 + Math.sin( timer ) * 5;
		this.camera.lookAt(this.focus);

		// Render
		this.renderer.render( this.scene, this.camera );

		this.stats.end();

		requestAnimationFrame( function() { that.update(); } );
	};
	Game.prototype.handleKeypress = function(key) {
		//console.log(key);
		switch (key)
		{
			case 119:
			this.camera.position.z += 1;
			break;
			case 115:
			this.camera.position.z -= 1;
			break;
			case 100:
			this.camera.position.x += 1;
			break;
			case 97:
			this.camera.position.x -= 1;
			break;
		}
	}

	var theGame = new Game('../maps/Level05');
	requestAnimationFrame( function() { theGame.update(); } );

	document.onkeypress = function(e) { 
		e = e || window.event;
		theGame.handleKeypress(e.keyCode || e.which);
	}
});