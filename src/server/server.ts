import fs from "fs";
import express from "express";
import path from "path";
import https from "https";

const port: number = 443;

class App {
    private server: https.Server;
    private port: number;

    constructor( port: number ) {
        this.port = port;
        const app = express();
        app.use( express.static( path.join( __dirname, "../client" ) ) );
        app.use(
            "/build/three.module.js",
            express.static( path.join( __dirname, "../../node_modules/three/build/three.module.js" ) )
        );

        app.use( "/jsm/:folder/:file", ( req, res ) => {
            res.sendFile(
                path.join(
                    __dirname,
                    "../../node_modules/three/examples/jsm/" + req.params.folder + "/" + req.params.file + ".js"
                )
            );
        } );

        app.use( "/assets/:folder/:file", ( req, res ) => {
            res.sendFile( path.join( __dirname, "../../dist/client/assets/" + req.params.folder + "/" + req.params.file ) );
        } );

        const options = {
            key: fs.readFileSync( 'c:/GitRepos/localhost-key.pem' ),
            cert: fs.readFileSync( 'c:/GitRepos/localhost.pem' )
        };
        this.server = https.createServer( options, app );

    }

    public Start () {
        this.server.listen( this.port, () => {
            console.log( `Server listening on port ${ this.port }.` );
        } );
    }
}

new App( port ).Start();
