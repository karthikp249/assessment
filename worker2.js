const { parentPort } = require('worker_threads');

let total = 0;
    for(var i=0; i<10000000000; i++){
        total++;
    }

parentPort.postMessage(total);