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
    path: '/tools/{id}',
    handler: (request, h) => handler.getDetailToolHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/tools/{id}',
    handler: (request, h) => handler.deleteToolByTeamIdHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/tools/{id}',
    handler: (request, h) => handler.putToolByTeamIdHandler(request, h),
    options: {
      auth: 'app_jwt',
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
