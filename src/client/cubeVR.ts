import { Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, BoxGeometry, WebGLRenderer } from "/build/three.module.js";
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
const geoSphere = new BoxGeometry( 0.5, 0.5, 0.5 ).translate( 0, 0.1, 0 );
const material = new MeshBasicMaterial( {
    color: 0xffffff * Math.random(),
    wireframe: true
} );

const meshSphere: Mesh = new Mesh( geoSphere, material );

init();
animate();

function init () {
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( VRButton.createButton( renderer ) );

    // xr
    renderer.xr.enabled = true;

    window.addEventListener( "resize", onWindowResize, false );
    meshSphere.position.z = -2;
    scene.add( meshSphere );
}

function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    render();
}

function animate (): void {
    // requestAnimationFrame( animate );
    renderer.setAnimationLoop( animate );
    meshSphere.rotation.x += 0.001;
    meshSphere.rotation.y += 0.001;
    meshSphere.rotation.z += 0.001;
    render();
}

function render (): void {
    renderer.render( scene, camera );
}
