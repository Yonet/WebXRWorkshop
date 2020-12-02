import { Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, WebGLRenderer } from "/build/three.module.js";
// Scene
const canvas = document.getElementById("canvas");
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new Scene();
// Renderer
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: canvas,
});
// Geometry radius, width segment, height segment
const geometry = new SphereGeometry(0.5, 32, 32).translate(0, 0.1, 0);
const material = new MeshBasicMaterial({
    color: 0xffff00 * Math.random(),
});
const earth = new Mesh(geometry, material);
init();
animate();
function init() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", onWindowResize, false);
    earth.position.z = -2;
    scene.add(earth);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
function animate() {
    renderer.setAnimationLoop(animate);
    earth.rotation.y += 0.01;
    render();
}
function render() {
    renderer.render(scene, camera);
}
