import { Mesh, MeshBasicMaterial, MeshPhongMaterial, HemisphereLight, PerspectiveCamera, TextureLoader, Scene, SphereGeometry, WebGLRenderer } from "/build/three.module.js";

// Scene
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const camera: PerspectiveCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene: Scene = new Scene();

// Renderer
const renderer: WebGLRenderer = new WebGLRenderer({
	antialias: true,
	canvas: canvas,
});

// Material
const texture = new TextureLoader().load("assets/images/globe/earthmap4k.jpg");
const bumpMap = new TextureLoader().load("assets/images/globe/earthbump4k.jpg");
const cloudsMap = new TextureLoader().load("assets/images/globe/earthclouds4k.png");
const material = new MeshPhongMaterial({
    specular: 0x222222,
    shininess: 25,
    bumpMap: bumpMap,
    bumpScale: 25,
    map: texture,
});
const materialClouds = new MeshPhongMaterial({
    specular: 0x222222,
    shininess: 25,
    opacity: 0.8,
    transparent: true,
    map: cloudsMap,
});

// Geometry radius, width segment, height segment
const geometry = new SphereGeometry(0.5, 14 , 14).translate(0, 0.1, 0);
const earth: Mesh = new Mesh(geometry, material);
const cloudGeometry = new SphereGeometry(0.55, 14 , 14).translate(0, 0.1, 0);
const clouds = new Mesh(cloudGeometry,materialClouds);

init();
animate();

function init() {
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

  //light
  const light = new HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

	window.addEventListener("resize", onWindowResize, false);
	earth.position.z = -2;
  clouds.position.z = -2;
	scene.add(earth);
  scene.add(clouds);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);

	render();
}

function animate(): void {
  requestAnimationFrame(animate);
	// renderer.setAnimationLoop(animate);
	earth.rotation.y += 0.001;
  clouds.rotation.y += 0.002;
	render();
}

function render(): void {
	renderer.render(scene, camera);
}
