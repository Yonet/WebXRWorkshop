import { Mesh, MeshBasicMaterial, MeshPhongMaterial, HemisphereLight, PerspectiveCamera, TextureLoader, Scene, SphereGeometry, WebGLRenderer } from "/build/three.module.js";
import { VRButton } from './jsm/webxr/VRButton';


// Scene
const canvas = <HTMLCanvasElement> document.getElementById( "canvas" );
const camera: PerspectiveCamera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const scene: Scene = new Scene();

// Renderer
const renderer: WebGLRenderer = new WebGLRenderer( {
    antialias: true,
    canvas: canvas,
} );

// Geometry radius, width segment, height segment
const geometry = new SphereGeometry( 0.5, 14, 14 ).translate( 0, 0.1, 0 );
const material = new MeshBasicMaterial( {
    color: 0xffff00 * Math.random(),
    wireframe: true
} );

const earth: Mesh = new Mesh( geometry, material );

init();
animate();

function init () {
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( VRButton.createButton( renderer ) );

    // xr
    renderer.xr.enabled = true;

    window.addEventListener( "resize", onWindowResize, false );
    earth.position.z = -2;
    scene.add( earth );
}

function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    render();
}

function animate (): void {
    requestAnimationFrame( animate );
    // renderer.setAnimationLoop( animate );
    earth.rotation.x += 0.001;
    render();
}

function render (): void {
    renderer.render( scene, camera );
}
