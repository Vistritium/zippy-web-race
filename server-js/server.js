'use strict';

const ipc=require('./node_modules/node-ipc');
var WebSocketServer = require('websocket').server;
var WebSocketClient = require('websocket').client;
var http = require('http');

ipc.config.socketRoot = '';
ipc.config.appspace = '';
ipc.config.id = 'mynamedpipe';// '';
ipc.config.networkHost = '127.0.0.1';
ipc.config.IPType = 'IPv4';
ipc.config.rawBuffer = true;
ipc.config.encoding = 'utf8';
ipc.config.networkPort = 8183;
ipc.config.retry= 1500;

console.log(ipc.config);

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
var client = new WebSocketClient();

server.listen(8184, function() {
    console.log((new Date()) + ' Server is listening on port 8184');
});

var wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production 
    // applications, as it defeats all standard cross-origin protection 
    // facilities built into the protocol and the browser.  You should 
    // *always* verify the connection's origin and decide whether or not 
    // to accept it. 
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            //console.log('Received Message: ' + message.utf8Data);
            //connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            //console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            //connection.sendBytes(message.binaryData);
        }
    });
    sendToWebSocket = function (data) {
        if (true) {//connection.connected) {
			//console.log(convertToString(data));
            connection.sendUTF(data);
            //connection.sendBytes(data);
        }
    }
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        } else {
            console.log("Received:bin");
		}
    });
    
    sendToWebSocket = function (data) {
        if (connection.connected) {
			//console.log(convertToString(data));
            connection.sendUTF(data);
            //connection.sendBytes(data);
        }
    }
});
 
//client.connect('ws://localhost:8184/', 'echo-protocol');

var W3CWebSocket = require('websocket').w3cwebsocket;
 
//client = new W3CWebSocket('ws://localhost:8184/', 'echo-protocol');
 
client.onerror = function() {
    console.log('Connection Error');
};
 
client.onopen = function() {
    console.log('WebSocket Client Connected');
 
    sendToWebSocket = function (data) {
        if (client.readyState === client.OPEN) {
			//console.log(convertToString(data));
            client.send(data);
            //connection.sendBytes(data);
        }
    }
};
 
client.onclose = function() {
    console.log('echo-protocol Client Closed');
};
 
client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
    }
};

var sendToWebSocket = function(data) {}; 

function convertToString (data) {
    var i, str = '';

    for (i = 0; i < data.length; ++i) {
        str += String.fromCharCode(data[i]);
    }

    return str;
}

function convertToBytes (str, isNullTerminated) {
    var i, bytes = [];

    for (i = 0; i < str.length; ++i) {
        bytes.push(str.charCodeAt(i))
    }
    if (isNullTerminated) {
        bytes.push(0);
    }

    return bytes;
}

ipc.serve(
    function(){
        ipc.server.on(
            'connect',
            function(socket){
                ipc.server.emit(
                    socket,
                    convertToBytes("Hello mofugga!", true)
                );
            }
        );

        ipc.server.on(
            'data',
            function(data, socket) {
                //ipc.log('got a message', convertToString(data));
                
				sendToWebSocket(data);
                ipc.server.emit(
                    socket,
                    convertToBytes("Whoop dee doo!", true)
                );
            }
        );
    }
);

ipc.server.start();
