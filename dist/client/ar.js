import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "/build/three.module.js";
const canvas = document.getElementById("canvas");
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new Scene();
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: canvas,
});
const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
});
const cube = new Mesh(geometry, material);
init();
animate();
function init() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    window.addEventListener("resize", onWindowResize, false);
    cube.position.z = -2;
    scene.add(cube);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
function animate() {
    renderer.setAnimationLoop(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    render();
}
function render() {
    renderer.render(scene, camera);
}
