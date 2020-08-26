'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/auth', controller.auth.index);
  router.post('/upload', controller.auth.upload);
};
