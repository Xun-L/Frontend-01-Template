const net = require('net');
// const client = net.createConnection(
//   {
//     host: '127.0.0.1',
//     port: 8080,
//   },
//   () => {
//     console.log('connected to server!');
//     client.write(request);
//     client.write('\r\n');
//   }
// );
// client.on('data', (data) => {
//   console.log(data.toString());
//   client.end();
// });
// client.on('end', (data) => {
//   console.log('disconnected from server');
// });
// client.on('error', (error) => {
//   console.log(error);
//   client.end();
// });
class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.path = options.path || '127.0.0.1';
    this.port = options.port || 80;
    this.body = options.body || {};
    this.headers = Object.assign(
      {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      options.headers
    );
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join('&');
    }
    this.headers['Content-Length'] = this.bodyText.length;
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers)
      .map((key) => `${key}:${this.headers[key]}`)
      .join('\r\n')}\r\n\r\n${this.bodyText}`;
  }
 

  send(connection) {
    let parser = new ResponseParser();
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
            headers: this.headers,
          },
          () => {
            connection.write(this.toString());
          }
        );
      }
      connection.on('data', (data) => {
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
        }
        connection.end();
      });
      connection.on('error', (err) => {
        reject(err);
        connection.end();
      });
    });
  }
}

class ResponseParser {
  constructor() {
    this.WATING_STATUS_LINE = 0;
    this.WATING_STATUS_LINEEND = 1;
    this.WATING_HEADER_NAME = 2;
    this.WATING_HEADER_VALUE = 3;
    this.WATING_HEADER_LINEEND = 4;
    this.WATING_HEADER_BLOCK_END = 5;
    this.WATING_HEADER_SPACE = 6;
    this.WATING_BODY = 7;
    this.current = this.WATING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
  }
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }
  receiveChar(char) {
    if (this.current === this.WATING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WATING_STATUS_LINEEND;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WATING_STATUS_LINEEND) {
      if (char === '\n') {
        this.current = this.WATING_HEADER_NAME;
      }
    } else if (this.current === this.WATING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WATING_HEADER_SPACE;
      } else if (char === '\r') {
        this.current = this.WATING_HEADER_BLOCK_END;
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WATING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WATING_HEADER_VALUE;
      }
    } else if (this.current === this.WATING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WATING_HEADER_LINEEND;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WATING_HEADER_LINEEND) {
      if (char === '\n') {
        this.current = this.WATING_HEADER_NAME;
      }
    } else if (this.current === this.WATING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WATING_BODY;
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser();
        }
      }
    } else if (this.current === this.WATING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(''),
    };
  }
}
class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINEEND = 1;
    this.READING_TRUNK = 2;
    this.WATING_NEW_LINE = 3;
    this.WATING_NEW_LINEEND = 4;
    this.isFinished = false;
    this.length = 0;
    this.content = [];
    this.current = this.WAITING_LENGTH;
  }
  receiveChar(char) {
    if(this.isFinished){
      return
    }

    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINEEND;
      } else {
        this.length *= 10;
        this.length += char.charCodeAt(0) - '0'.charCodeAt(0);
      }
    } else if (this.current === this.WAITING_LENGTH_LINEEND) {
      if (char === '\n') {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.current = this.WATING_NEW_LINE;
      }
    } else if (this.current === this.WATING_NEW_LINE) {

      if (char === '\r') {
        this.current = this.WATING_NEW_LINEEND;
      }
    } else if (this.current === this.WATING_NEW_LINEEND) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}
void (async function () {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8080,
    path: '/',
    headers: {
      'X-Foo2': 'xxx',
    },
    body: {
      name: 'lixun',
    },
  });

  let response = await request.send();
  console.log(response)
})();
class Response {}
