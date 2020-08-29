'use strict';
const Controller = require('egg').Controller;
const unzip = require('unzipper');
const client_id = 'Iv1.a210cdcebcae98e3';
const state = 'l3';
const client_secret = '3b1122d98fc8a55d6250f78d04120906ba4a4270';

class authController extends Controller {
  async index() {
    const { ctx } = this;
    let acceessToken = null;
    if (!acceessToken) {
      const result = await ctx.curl(
        'https://github.com/login/oauth/access_token',
        {
          dataType: 'json',
          method: 'POST',
          data: {
            client_id,
            state,
            client_secret,
            code: ctx.query.code
          }
        }
      );
      acceessToken = result.res.data.access_token;
    }
    ctx.body = `<a href="http://localhost:7003/publish?token=${acceessToken}">发布</a>`;
  }
  async upload() {
    const { ctx } = this;
    const req = ctx.req;
    const acceessToken = ctx.get('Authorization');
    // 用户的信息校验
    const userInfo = await ctx.curl('https://api.github.com/user', {
      method: 'get',
      headers: {
        Authorization: 'token ' + acceessToken
      },
      dataType: 'json'
    });
    if (userInfo.data.login === 'Xu-L') {
      const writeStream = unzip.Extract({ path: '../server/public' });
      ctx.set('connection', 'keep-alive');
      await saveStream(req, writeStream);
      ctx.body = {
        code: 200,
        msg: '上传成功'
      };
    } else {
      ctx.status = 403;
      ctx.body = {
        code: 403,
        msg: '上传失败'
      };
    }
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
