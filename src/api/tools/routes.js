const path = require('path');

module.exports = (handler) => [
  {
    method: 'GET',
    path: '/tools',
    handler: (request, h) => handler.getToolHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  {
    method: 'POST',
    path: '/tools',
    handler: (request, h) => handler.postToolHandler(request, h),
    options: {
      auth: 'app_jwt',
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../uploads'),
      },
    },
    options: {
      auth: 'app_jwt',
    },
  },
];
