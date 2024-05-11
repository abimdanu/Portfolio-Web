var path = require('path');
var http = require('http');
var fs = require('fs');

var dir = path.join(__dirname);

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

var server = http.createServer((req, res) => {
    var reqPath = req.url.toString().split('?')[0];
    if (req.method !== 'GET') {
        res.statusCode = 501;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Method not implemented');
    }

    var file = path.join(dir, reqPath.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Forbidden');
    }

    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var stream = fs.createReadStream(file);

    stream.on('open', () => {
        res.setHeader('Content-Type', type);
        stream.pipe(res);
    });

    stream.on('error', () => {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });
});

server.listen(8080, () => {
    console.log('Serving on http://localhost:8080/');
});