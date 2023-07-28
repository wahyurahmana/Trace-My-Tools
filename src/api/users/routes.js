module.exports = (handler) => [
  {
    method: 'GET',
    path: '/users',
    handler: (request, h) => handler.getUserHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  { // used FE
    method: 'POST',
    path: '/users/change-password',
    handler: (request, h) => handler.putPasswordUserHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  { // used FE
    method: 'POST',
    path: '/register',
    handler: (request, h) => handler.postUserHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  { // used FE
    method: 'GET',
    path: '/users-list',
    handler: (request, h) => handler.getAllEmailWithTeamHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  { // used FE
    method: 'POST',
    path: '/login',
    handler: (request, h) => handler.loginHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/users/{idUser}',
    handler: (request, h) => handler.deleteUserHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/users/{idUser}',
    handler: (request, h) => handler.putUserHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  {
    method: 'GET',
    path: '/users/{idUser}',
    handler: (request, h) => handler.detailUserHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
];
