import { Clock, HemisphereLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, RingBufferGeometry, Scene, SphereBufferGeometry, WebGLRenderer, } from "/build/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls";
import { GUI } from "/jsm/libs/dat.gui.module";
import Stats from "/jsm/libs/stats.module";
import { ARButton } from "/jsm/webxr/ARButton";
const canvas = document.getElementById("canvas");
const clock = new Clock();
const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new Scene();
const stats = Stats();
let reticle, controller;
let hitTestSource = null;
let hitTestSourceRequested = false;
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: canvas,
});
const controls = new OrbitControls(camera, renderer.domElement);
const geometry = new SphereBufferGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);
// const material: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
// const earth: Mesh = new Mesh(geometry, material);
init();
animate();
function init() {
    //light
    const light = new HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);
    //renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    //overlays: button and stats
    // document.body.appendChild(stats.dom);
    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] }));
    controller = renderer.xr.getController(0);
    controller.addEventListener("select", onSelect);
    scene.add(controller);
    //Hittest indicator
    reticle = new Mesh(new RingBufferGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2), new MeshBasicMaterial());
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
    window.addEventListener("resize", onWindowResize, false);
    // earth.position.z = -2;
    // scene.add(earth);
    addGui();
}
function onSelect() {
    if (reticle.visible) {
        const material = new MeshPhongMaterial({
            color: 0xffffff * Math.random(),
        });
        const mesh = new Mesh(geometry, material);
        mesh.position.setFromMatrixPosition(reticle.matrix);
        mesh.scale.y = Math.random() * 2 + 1;
        scene.add(mesh);
    }
}
function addGui() {
    const gui = new GUI();
    // gui.add(earth.rotation, "x", 0, Math.PI * 2, 0.01);
    // gui.add(earth.position, "z", -100, 0, 1);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    renderer.setAnimationLoop(render);
}
function render(timestamp, frame) {
    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();
        if (hitTestSourceRequested === false) {
            session.requestReferenceSpace("viewer").then((referenceSpace) => {
                session.requestHitTestSource({ space: referenceSpace }).then((source) => {
                    hitTestSource = source;
                });
            });
            session.addEventListener("end", () => {
                hitTestSourceRequested = false;
                hitTestSource = null;
            });
            hitTestSourceRequested = true;
        }
        if (hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);
            if (hitTestResults.length) {
                const hit = hitTestResults[0];
                reticle.visible = true;
                reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
            }
            else {
                reticle.visible = false;
            }
        }
    }
    controls.update();
    stats.update();
    renderer.render(scene, camera);
}
