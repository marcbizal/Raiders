require(['World'], function (World) {
	'use strict';

	var DEFAULT_FOV = 90;

	// THREE
	var camera, controls, renderer;
	var loader = new THREE.ColladaLoader();

	// STATS
	var stats;

	// RAIDERS
	var world;
	var light;
	var mouse = new THREE.Vector2();
	var mouse3D = new THREE.Vector3();

	var timeSinceMouseMove;
	var hoveredObject;
	var selectedObject;

	var isMouseDown = false;
	var mouseDownPosition = new THREE.Vector2();

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

		//loader.load('models/teleport-pad.dae', function (model) {
  			//world.scene.add(model.scene);
		//});

		light = new THREE.PointLight( 0xffffff, 1, 7 );
		light.position.set( 12.5, 3, 12.5 );
		world.scene.add( light );
		world.scene.fog = new THREE.FogExp2( 0x6e6e9b, 0.05 );

		document.body.appendChild(renderer.domElement);
		document.body.appendChild(stats.domElement);

		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('mousemove', onMouseMove, false);
		window.addEventListener('mousedown', onMouseDown, false);
		window.addEventListener('mouseup', onMouseUp, false);
	}

	function animate() {
		stats.begin();

		light.position.set(mouse3D.x, mouse3D.y+3, mouse3D.z);
		controls.update();
		renderer.render(world.scene, camera);
		stats.end();

		requestAnimationFrame(animate);
	}

	function onMouseDown()
	{
		isMouseDown = true;
		mouseDownPosition = mouse.clone();
	}

	function onMouseUp()
	{
		isMouseDown = false;
		var distance = mouseDownPosition.distanceTo(mouse);
		if (distance < 2) {
			if (selectedObject != undefined)
				selectedObject.mesh.children[0].material.color.setHex( 0xffffff );

			selectedObject = getIntersectObject();

			if (selectedObject != undefined)
				selectedObject.mesh.children[0].material.color.setHex( 0x7f00ff );
		}
		mouseDownPosition = new THREE.Vector2();
	}

	function getIntersectObject()
	{
		return getIntersect().object.parent.userData.parent;
	}

	function getIntersect()
	{
		var raycaster = new THREE.Raycaster();
		raycaster.setFromCamera( mouse, camera );	
		var intersects = raycaster.intersectObjects( world.map.group.children, true );

		if (intersects.length > 0)
	    {
			return intersects[0];;
	    }  
	    else
	    {
	    	return null;
	    }
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function onMouseMove(event)
	{
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		clearTimeout(timeSinceMouseMove);

		var intersect = getIntersect();

		if (intersect != null)
	    {
	    	if (!isMouseDown)
	    	{
		    	mouse3D.x = intersect.point.x;
		    	mouse3D.y = intersect.point.y;
		    	mouse3D.z = intersect.point.z;
	    	}
	    	timeSinceMouseMove = setTimeout(function () { hoveredObject = intersect.object.parent.userData.parent; }, 500);
	    }  
	}
});