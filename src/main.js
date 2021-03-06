// Ensure Webpack compiles sass...
require('../styles/main.scss');

import World from './World.js';
import Building from './Building.js';

const DEFAULT_FOV = 90;

// THREE
let camera,
  controls,
  renderer;
const loader = new THREE.ColladaLoader();

// STATS
let stats;

// RAIDERS
let world;
let light;
let teleportPad;
const mouse = new THREE.Vector2();
const mouse3D = new THREE.Vector3();

let timeSinceMouseMove;
let hoveredObject;
let selectedObject;

let isMouseDown = false;
const mouseDownPosition = new THREE.Vector2();

init();
animate();

function initStats() {
  stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms

	// align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild(stats.domElement);
}

function init() {
  console.log('Hello!');
  camera = new THREE.PerspectiveCamera(DEFAULT_FOV, window.innerWidth / window.innerHeight, 0.0001, 1000);
  controls = new THREE.OrbitControls(camera);

  renderer = new THREE.WebGLRenderer({ antialiasing: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  initStats();

  world = new World();
  world.loadMap('./maps/Level05.json', () => {
    const targetX = (world.map.getWidth() / 2) + 1;
    const targetY = (world.map.getHeight() / 2) - 2;

    camera.position.set(targetX - 2, 3, targetY + 2);
    controls.target.set(targetX, 0, targetY);

    teleportPad = new Building();
    teleportPad.scene = world.scene;
    teleportPad.setX(14);
    teleportPad.setZ(10);
    const y = world.map.getY(14.5, 10.5);
    teleportPad.setY(y + 0.1);
  });

  light = new THREE.PointLight(0xffffff, 1, 7);
  light.position.set(12.5, 3, 12.5);
  world.scene.add(light);
  world.scene.fog = new THREE.FogExp2(0x6e6e9b, 0.05);

  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('mousedown', onMouseDown, false);
  window.addEventListener('mouseup', onMouseUp, false);

  window.addEventListener('keydown', onKeyDown, false);
}

function animate() {
  stats.begin();

  light.position.set(mouse3D.x, mouse3D.y + 3, mouse3D.z);
  controls.update();
  renderer.render(world.scene, camera);
  stats.end();

  requestAnimationFrame(animate);
}

function onMouseDown() {
  isMouseDown = true;
}

function onMouseUp() {
  isMouseDown = false;
  if (selectedObject !== undefined) { selectedObject.mesh.children[0].material.color.setHex(0xffffff); }

  selectedObject = getIntersectObject();

  if (selectedObject !== undefined) { selectedObject.mesh.children[0].material.color.setHex(0x7f00ff); }
}

function getIntersectObject() {
  return getIntersect().object.parent.userData.parent;
}

function getIntersect() {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(world.map.group.children, true);

  if (intersects.length > 0) {
    return intersects[0];
  }
    	return null;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  clearTimeout(timeSinceMouseMove);

  const intersect = getIntersect();

  if (intersect !== null) {
    	if (!isMouseDown)    	{
	    	mouse3D.x = intersect.point.x;
	    	mouse3D.y = intersect.point.y;
	    	mouse3D.z = intersect.point.z;
    	}
    	timeSinceMouseMove = setTimeout(() => { hoveredObject = intersect.object.parent.userData.parent; }, 500);
  }
}

function onKeyDown(event) {
	 const keycode = event.keyCode ? event.keyCode : event.charCode;

	 switch (keycode)	 {
	 	case 67:
     {
       if (selectedObject)	 		{
	 			selectedObject.collapse();
	 		}
	 		break;
	 	}

	 	default:
	 	{
	 		break;
	 	}
	 }
}
