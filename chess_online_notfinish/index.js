const port = 8080;

const express = require( 'express' );
const mysql = require( 'mysql' );
const jsdom = require( 'jsdom' );
const { JSDOM } = jsdom;
JSDOM.fromFile( "./assets/views/index.html" ).then( dom => {
    const { window } = dom.window;
    const  { document } = dom.window.document;
  } );

const app = express( );
const server = require( 'http' ).createServer( app );
const io = require( 'socket.io' )(server);

const chess = require( './server_modules/Chessboard' );
  
const connection = mysql.createConnection( {
    host: "localhost",
    port: "3308",
    user: "root",
    password: "",
    database: "chess"
} );

connection.connect( function ( error ) {
    if ( error ) throw error;
    console.log ( "connected" );
} );

app.use( express.static( __dirname + '/assets/' ) );

app.get( '/', function( req, res, next ) {

    res.sendFile( __dirname + '/assets/views/index.html' );
    let board = new chess( );
    board.init( );
    connection.query( "SELECT * FROM player", function( error, rows, fields ) {
        if ( error ) throw error;
    })
})

server.listen( port );