const UserHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, validator, tokenManager }) => {
    const userHandler = new UserHandler(service, validator, tokenManager);
    server.route(routes(userHandler));
  },
};
