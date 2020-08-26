'use strict';
const Controller = require('egg').Controller;
const unzip = require('unzipper');
const https = require('https');

class authController extends Controller {
  async index() {
    const { ctx } = this;

    console.log(ctx.query);

    ctx.body = 'hi, egg';
  }
  async upload() {
    const { ctx } = this;
    const req = ctx.req;
    const writeStream = unzip.Extract({ path: '../server/public' });
    ctx.set('connection', 'keep-alive');
    await saveStream(req, writeStream);

    ctx.body = {
      code: 200,
      msg: '上传成功'
    };
    console.log(2333);
  }
}

function saveStream(stream, writeStream) {
  return new Promise((resolve, reject) => {
    stream.pipe(writeStream);
    writeStream.on('error', reject);
    writeStream.on('finish', resolve);
  });
}
module.exports = authController;
