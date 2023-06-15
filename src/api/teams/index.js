const TeamHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'teams',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const teamHandler = new TeamHandler(service, validator);
    server.route(routes(teamHandler));
  },
};
