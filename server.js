const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8081;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    // Enable CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - File Not Found</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                            h1 { color: #e74c3c; }
                            a { color: #3498db; text-decoration: none; }
                        </style>
                    </head>
                    <body>
                        <h1>404 - File Not Found</h1>
                        <p>The file <code>${req.url}</code> was not found.</p>
                        <p><a href="/">← Back to Home</a></p>
                    </body>
                    </html>
                `);
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`🚀 Puter AI Chatbot Server running at:`);
    console.log(`   Local:   http://localhost:${port}`);
    console.log(`   Main:    http://localhost:${port}/index.html`);
    console.log('');
    console.log('📱 Ctrl+C to stop the server');
    
    // Try to open the demo page in browser
    const { exec } = require('child_process');
    exec(`start http://localhost:${port}/index.html`);
});
