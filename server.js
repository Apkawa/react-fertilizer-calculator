const express = require('express');

// create a server
const app = express();


const server = require('http').createServer(app);

app.use('/', express.static(__dirname + "/build/"));

server.listen(9005);
