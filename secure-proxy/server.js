const http = require('http');

const port = 80;
http.createServer((req, res) => {
    res.writeHead(301, {"Location": `https://${req.headers['host']}${req.url}`});
    res.end();
}).listen(port, () => console.log(`Listening on port ${port}`));