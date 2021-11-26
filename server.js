const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { Worker, isMainThread } = require('worker_threads');

let count = 0;
app.get('/',(req,res)=>{
    count += 1;
    res.status(200).json({counter : count});
});

app.get('/heavy',(req,res)=>{
    const worker = new Worker('./worker');
    worker.on('message',(data)=>{
        res.status(200).json({total : data});
    });
});

app.listen(port,()=>{
    console.log(`App listening at http://localhost:${port}`)
});
