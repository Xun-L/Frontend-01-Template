const http = require('http');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');

let filename = './package';

fs.stat(filename, (err, stat) => {
    console.log(stat);
    const options = {
        host: 'localhost',
        port: 8089,
        path: '/?filename=' + 'package.zip',
        method: 'POST',
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
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
        // res.on('data', (chunk) => {
        //   console.log(`BODY: ${chunk}`);
        // });
        // res.on('end', () => {
        //   console.log('No more data in response.');
        // });
    });

    req.on('error', e => {
        console.error(`problem with request: ${e.message}`);
    });
    archive.pipe(req);
    archive.finalize();

    archive.on('end', () => {
        req.end();
        child_process.exec(
            'start chrome https://github.com/login/oauth/authorize?client_id=Iv1.a210cdcebcae98e3&state=lx22333'
        );
    });
    // Write data to request body
    //req.write(postData);
    //req.end();
});
