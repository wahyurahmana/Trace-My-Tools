module.exports = (handler) => [
  { // used FE
    method: 'GET',
    path: '/teams',
    handler: (request, h) => handler.getTeamHandler(request, h),
  },
  {
    // used BE via Postman
    method: 'POST',
    path: '/teams',
    handler: (request, h) => handler.postTeamHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  {
    // used BE via Postman
    method: 'DELETE',
    path: '/teams/{id}',
    handler: (request, h) => handler.deleteTeamHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  {
    // used BE via Postman
    method: 'PUT',
    path: '/teams/{id}',
    handler: (request, h) => handler.putTeamHandler(request, h),
    options: {
      auth: 'app_jwt',
    },
  },
  {
    method: 'GET',
    path: '/teams/{id}',
    handler: (request, h) => handler.detailTeamHandler(request, h),
  },
];
