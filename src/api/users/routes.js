module.exports = (handler) => [
  {
    method: 'GET',
    path: '/users',
    handler: (request, h) => handler.getUserHandler(request, h),
  },
  {
    method: 'POST',
    path: '/register',
    handler: (request, h) => handler.postUserHandler(request, h),
  },
  {
    method: 'POST',
    path: '/login',
    handler: (request, h) => handler.loginHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/users/{idBadge}',
    handler: (request, h) => handler.deleteUserHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/users/{idBadge}',
    handler: (request, h) => handler.putUserHandler(request, h),
  },
  {
    method: 'GET',
    path: '/users/{idBadge}',
    handler: (request, h) => handler.detailUserHandler(request, h),
  },
];
