const http = require('http');
const fs = require('fs');
const unzip = require('unzipper');




const server = http.createServer((req, res) => {
  let filename = req.url.match(/filename=([^&]+)/)[1];
  let writeStream = unzip.Extract({ path: '../server/public' });

  req.pipe(writeStream);
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('fine');
  });
});

server.listen(8089);
