const path = require('path');

module.exports = (handler) => [
  { // used FE
    method: 'GET',
    path: '/tools',
    handler: (request, h) => handler.getToolHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  { // used FE
    method: 'POST',
    path: '/tools',
    handler: (request, h) => handler.postToolHandler(request, h),
    options: {
      auth: 'app_jwt',
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 5242880,
      },
    },
  },
  { // used FE
    method: 'GET',
    path: '/tools/{id}',
    handler: (request, h) => handler.getDetailToolHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  { // used FE
    method: 'DELETE',
    path: '/tools/{id}',
    handler: (request, h) => handler.deleteToolByTeamIdHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  { // used FE
    method: 'PUT',
    path: '/tools/{id}',
    handler: (request, h) => handler.putToolByTeamIdHandler(request, h),
    options: {
      auth: 'app_jwt',
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 5242880,
      },
    },
  },
  { // used FE
    method: 'GET',
    path: '/uploads/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../uploads/'),
      },
    },
  },
];
