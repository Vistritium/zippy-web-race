'use strict';

const ipc=require('./node_modules/node-ipc');

/***************************************\
 *
 * You should start both hello and world
 * then you will see them communicating.
 *
 * *************************************/

ipc.config.id = 'hello';
ipc.config.retry= 1500;
ipc.config.rawBuffer=true;
ipc.config.encoding='hex';

ipc.config.networkHost = '127.0.0.1';
ipc.config.IPType = 'IPv4';
ipc.config.networkPort = 8183;

ipc.connectTo(
    'game-socket',
    function(){
        ipc.of['game-socket'].on(
            'connect',
            function(){
                //make a 6 byte buffer for example
                const myBuffer=new Buffer(6).fill(0);

                myBuffer.writeUInt16BE(0x02,0);
                myBuffer.writeUInt32BE(0xffeecc,2);

                ipc.log('## connected to world ##', ipc.config.delay);
                ipc.of['game-socket'].emit(
                    myBuffer
                );
            }
        );

        ipc.of['game-socket'].on(
            'data',
            function(data){
                ipc.log('got a message from world : ', data);
            }
        );
    }
);