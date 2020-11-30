import express from "express";
import path from "path";
import http from "http";

const port: number = 3000;

class App {
	private server: http.Server;
	private port: number;

	constructor(port: number) {
		this.port = port;
		const app = express();
		app.use(express.static(path.join(__dirname, "../client")));
		app.use(
			"/build/three.module.js",
			express.static(
				path.join(
					__dirname,
					"../../node_modules/three/build/three.module.js"
				)
			)
		);
		// app.use('/three/src/cameras/PerspectiveCamera', express.static(path.join(__dirname, '../../node_modules/three/src/cameras/PerspectiveCamera.js')))
		// app.use('/three/src/renderers/WebGLRenderer', express.static(path.join(__dirname, '../../node_modules/three/src/renderers/WebGLRenderer.js')))
		// app.use('/three/src/scenes/Scene', express.static(path.join(__dirname, '../../node_modules/three/src/scenes/Scene.js')))
		// app.use('/three/src/scenes/Scene', express.static(path.join(__dirname, '../../node_modules/three/src/scenes/Scene.js')))
		app.use(
			"/jsm/controls/OrbitControls",
			express.static(
				path.join(
					__dirname,
					"../../node_modules/three/examples/jsm/controls/OrbitControls.js"
				)
			)
		);
		app.use(
			"/jsm/libs/stats.module",
			express.static(
				path.join(
					__dirname,
					"../../node_modules/three/examples/jsm/libs/stats.module.js"
				)
			)
		);
		app.use(
			"/jsm/libs/dat.gui.module",
			express.static(
				path.join(
					__dirname,
					"../../node_modules/three/examples/jsm/libs/dat.gui.module.js"
				)
			)
		);
		app.use(
			"/jsm/webxr/ARButton",
			express.static(
				path.join(
					__dirname,
					"../../node_modules/three/examples/jsm/webxr/ARButton.js"
				)
			)
		);
		app.use(
			"/jsm/webxr/VRButton",
			express.static(
				path.join(
					__dirname,
					"../../node_modules/three/examples/jsm/webxr/VRButton.js"
				)
			)
		);

		this.server = new http.Server(app);
	}

	public Start() {
		this.server.listen(this.port, () => {
			console.log(`Server listening on port ${this.port}.`);
		});
	}
}

new App(port).Start();
