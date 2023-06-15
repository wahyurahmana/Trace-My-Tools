module.exports = (handler) => [
  {
    method: 'GET',
    path: '/roles',
    handler: (request, h) => handler.getddRoleHandler(request, h),
  },
  {
    method: 'POST',
    path: '/roles',
    handler: (request, h) => handler.postddRoleHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/roles/{id}',
    handler: (request, h) => handler.deleteddRoleHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/roles/{id}',
    handler: (request, h) => handler.putddRoleHandler(request, h),
  },
  {
    method: 'GET',
    path: '/roles/{id}',
    handler: (request, h) => handler.detailddRoleHandler(request, h),
  },
];
