const http = require('http');
const server = http.createServer((req, res) => {
  console.log('recieve requset');
  console.log(req.headers);
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, {
    'Content-type': 'text/plain',
  });
  res.end(`
  <html maaa=a >
  <head>
      <style>
  body div{
      display:flex;
      width:100px
  } 


  body div #myid{
     flex:1;
     height:100px;      

      background-color: #ff5000;
  }
  body div img{
    flex:2;
    height:200px;
      background-color: #ff1111;
  }
      </style>
  </head>
  <body>
      <div>
          <img id="myid"/>
          <img />
      </div>
  </body>
  </html>
  `);
});
server.listen(8080);
