const UserHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.1',
  register: async (server, {
    service, validator, tokenManager, authService, senderWA,
  }) => {
    const userHandler = new UserHandler(service, validator, tokenManager, authService, senderWA);
    server.route(routes(userHandler));
  },
};
