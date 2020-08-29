const http = require('http');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');
const { encode } = require('punycode');

child_process.exec(
  `start chrome "https://github.com/login/oauth/authorize?state=l3&client_id=Iv1.a210cdcebcae98e3"`
);
const server = http.createServer((req, res) => {
  let path = req.url.match(/([^/^?]+)/)[0];
  if (path === 'publish') {
    let token = req.url.match(/token=([^&]+)/)[1];
    let filename = './package';

    fs.stat(filename, (err, stat) => {
      const options = {
        host: 'localhost',
        port: 7001,
        path: '/upload?filename=' + 'package.zip',
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: token,
          'Content-Type': 'application/octet-stream'
        }
      };

      let archive = archiver('zip', {
        zlib: { level: 9 }
      });
      archive.directory(filename, false);

      const req = http.request(options, res => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
      });

      req.on('error', e => {
        console.error(`problem with request: ${e.message}`);
      });
      archive.pipe(req);
      archive.finalize();

      archive.on('end', () => {
        console.log('end1');
        req.end();
        server.close();
      });
    });
  }

  req.on('end', () => {
    console.log('end2');
    setImmediate(() => {
      server.close();
    });
  });
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(7003);
