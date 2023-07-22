module.exports = (handler) => [
  { // used FE
    method: 'GET',
    path: '/activities',
    handler: (request, h) => handler.getActivityHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  { // used fe
    method: 'POST',
    path: '/activities',
    handler: (request, h) => handler.postActivityHandler(request, h),
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
  { // used fe
    method: 'DELETE',
    path: '/activities/{id}',
    handler: (request, h) => handler.deleteActivityHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  { // used fe
    method: 'PATCH',
    path: '/activities/{id}',
    handler: (request, h) => handler.patchActivityChangeStatusHandler(request, h),
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
  { // used fe
    method: 'GET',
    path: '/activities/{id}',
    handler: (request, h) => handler.getDetailActivityHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
];
