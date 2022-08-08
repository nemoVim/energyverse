const express = require('express');
const app = express();
const port = 80;

app.use('/', express.static(__dirname));
// app.use('/src/js', express.static('/src/js'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/html/index.html');
});

app.listen(port, () => {
    console.log("[Start Server]");
});