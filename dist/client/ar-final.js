import { Mesh, MeshBasicMaterial, MeshPhongMaterial, HemisphereLight, RingBufferGeometry, PerspectiveCamera, TextureLoader, Scene, SphereGeometry, WebGLRenderer } from "/build/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls";
import Stats from "/jsm/libs/stats.module";
import { ARButton } from '/jsm/webxr/ARbutton';
// Scene
const canvas = document.getElementById("canvas");
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new Scene();
const stats = Stats();
let reticle, controller;
let hitTestSource = null;
let hitTestSourceRequested = false;
// Renderer
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: canvas,
});
const controls = new OrbitControls(camera, renderer.domElement);
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
const geometry = new SphereGeometry(0.5, 14, 14).translate(0, 0.1, 0);
const phongMaterial = new MeshPhongMaterial({
    color: 0xffffff * Math.random()
});
const earth = new Mesh(geometry, material);
const cloudGeometry = new SphereGeometry(0.55, 14, 14).translate(0, 0.1, 0);
const clouds = new Mesh(cloudGeometry, materialClouds);
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
    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] }));
    controller = renderer.xr.getController(0);
    controller.addEventListener("select", onSelect);
    scene.add(controller);
    //Hittest indicator
    const reticle = new Mesh(new RingBufferGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2), new MeshBasicMaterial());
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
    scene.add(earth);
    scene.add(clouds);
    earth.position.z = -2;
    clouds.position.z = -2;
    window.addEventListener("resize", onWindowResize, false);
}
function onSelect() {
    if (reticle.visible) {
        const mesh = new Mesh(geometry, phongMaterial);
        earth.position.setFromMatrixPosition(reticle.matrix);
        clouds.position.setFromMatrixPosition(reticle.matrix);
        mesh.position.setFromMatrixPosition(reticle.matrix);
        mesh.scale.y = Math.random() * 2 + 1;
        scene.add(earth);
        scene.add(clouds);
        scene.add(mesh);
    }
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    renderer.setAnimationLoop(render);
}
function render(timestamp, xrFrame) {
    if (xrFrame) {
        earth.visible = false;
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
            const hitTestResults = xrFrame.getHitTestResults(hitTestSource);
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
