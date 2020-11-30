import { BoxGeometry, Clock, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer, } from "/build/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls";
import { VRButton } from "/jsm/webxr/VRButton";
import Stats from "/jsm/libs/stats.module";
import { GUI } from "/jsm/libs/dat.gui.module";
const canvas = document.getElementById("canvas");
const clock = new Clock();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new Scene();
const stats = Stats();
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: canvas,
});
const controls = new OrbitControls(camera, renderer.domElement);
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
    document.body.appendChild(stats.dom);
    document.body.appendChild(VRButton.createButton(renderer));
    window.addEventListener("resize", onWindowResize, false);
    cube.position.z = -2;
    scene.add(cube);
    addGui();
}
function addGui() {
    const gui = new GUI();
    gui.add(cube.rotation, "x", 0, Math.PI * 2, 0.01);
    gui.add(cube.position, "z", -100, 0, 1);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
function animate() {
    // requestAnimationFrame(animate)
    renderer.setAnimationLoop(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();
    render();
    stats.update();
}
function render() {
    renderer.render(scene, camera);
}
