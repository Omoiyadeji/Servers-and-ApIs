const http = require('http');
const fs = require('fs');
const path = require('path');

const serveFile = (filePath, res, contentType, statusCode = 200) => {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, '404.html'), (error, errorContent) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(errorContent, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(statusCode, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
};

// Create server
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    if (extname === '.html') {
        serveFile(filePath, res, contentType);
    } else {
        serveFile(path.join(__dirname, '404.html'), res, 'text/html', 404);
    }
});

// Start the server on port 8000
server.listen(8000, () => {
    console.log('Server running at http://localhost:8000');
});
