require(['World'], function (World) {
	'use strict';

	var DEFAULT_FOV = 90;

	// THREE
	var camera, controls, renderer;

	// STATS
	var stats;

	// RAIDERS
	var world;
	var light;

	init();
	animate();

	function init() 
	{
		camera = new THREE.PerspectiveCamera(DEFAULT_FOV, window.innerWidth/window.innerHeight, 0.0001, 1000);
		controls = new THREE.OrbitControls(camera);

		renderer = new THREE.WebGLRenderer({ antialiasing: true });
		renderer.setSize(window.innerWidth, window.innerHeight);

		stats = new Stats();
		stats.setMode(0); // 0: fps, 1: ms

		// align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		world = new World();
		world.loadMap('../maps/Level05', function() {
			var targetX = (world.map.getWidth() / 2)+1;
			var targetY = (world.map.getHeight() / 2)-2;

			camera.position.set(targetX-2, 3, targetY+2);
			controls.target.set(targetX, 0, targetY);
		});

		light = new THREE.PointLight( 0xffffff, 1, 7 );
		light.position.set( 12.5, 3, 12.5 );
		world.scene.add( light );
		world.scene.fog = new THREE.FogExp2( 0x6e6e9b, 0.05 );

		document.body.appendChild(renderer.domElement);
		document.body.appendChild(stats.domElement);

		window.addEventListener('resize', onWindowResize, false);
	}

	function animate() {
		stats.begin();


		controls.update();
		renderer.render(world.scene, camera);
		stats.end();

		requestAnimationFrame(animate);
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}
});