const UserHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.1',
  register: async (server, {
    service, validator, tokenManager, authService,
  }) => {
    const userHandler = new UserHandler(service, validator, tokenManager, authService);
    server.route(routes(userHandler));
  },
};
