/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});
  config.security = {
    csrf: {
      enable: false
    }
  };
  config.bodyParser = {
    // 值的大小可以根据自己的需求修改
    formLimit: '30mb',
    jsonLimit: '30mb',
    textLimit: '30mb',
    streamLimit: '30mb'
  };
  config.multipart = {
    fields: 50, // 表单上传字段限制的个数
    fileSize: '100mb', // 文件上传的大小限制
    filedSize: '100mb'
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1598371398512_243';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig
  };
};
