module.exports = (handler) => [
  {
    method: 'GET',
    path: '/activities',
    handler: (request, h) => handler.getActivityHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  {
    method: 'POST',
    path: '/activities',
    handler: (request, h) => handler.postActivityHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/activities/{id}',
    handler: (request, h) => handler.deleteActivityHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  {
    method: 'PATCH',
    path: '/activities/change-status/{id}',
    handler: (request, h) => handler.putActivityChangeStatusHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
];
