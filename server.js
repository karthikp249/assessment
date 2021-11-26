const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { Worker, isMainThread, workerData } = require('worker_threads');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './resources/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '.csv');
    }
});

const upload = multer({ storage: storage })


let count = 0;
app.get('/', (req, res) => {
    count += 1;
    res.status(200).json({ counter: count });
});

app.post('/upload', upload.single('datasheet'), (req, res) => {
    const worker = new Worker('./worker_old', { workerData: { text: 'hello' } });
    worker.on('message', (data) => {
        res.status(200).send(data)
    });
});

app.get('/heavy', (req, res) => {
    const worker = new Worker('./worker2');
    worker.on('message', (data) => {
        res.status(200).json({ total: data })
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});
