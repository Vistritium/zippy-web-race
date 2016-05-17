'use strict';

const ipc=require('./node_modules/node-ipc');

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
                ipc.log('got a message', convertToString(data));
                ipc.server.emit(
                    socket,
                    convertToBytes("Whoop dee doo!", true)
                );
            }
        );
    }
);

ipc.server.start();