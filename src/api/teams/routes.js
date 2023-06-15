module.exports = (handler) => [
  {
    method: 'GET',
    path: '/teams',
    handler: (request, h) => handler.getTeamHandler(request, h),
  },
  {
    method: 'POST',
    path: '/teams',
    handler: (request, h) => handler.postTeamHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/teams/{id}',
    handler: (request, h) => handler.deleteTeamHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/teams/{id}',
    handler: (request, h) => handler.putTeamHandler(request, h),
  },
  {
    method: 'GET',
    path: '/teams/{id}',
    handler: (request, h) => handler.detailTeamHandler(request, h),
  },
];
