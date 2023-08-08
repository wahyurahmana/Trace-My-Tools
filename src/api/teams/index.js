const TeamHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'teams',
  version: '1.0.1',
  register: async (server, { service, validator, authService }) => {
    const teamHandler = new TeamHandler(service, validator, authService);
    server.route(routes(teamHandler));
  },
};
