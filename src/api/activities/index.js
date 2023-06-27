const ActivityHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'activities',
  version: '1.0.0',
  register: async (server, { service, validator, authService }) => {
    const activityHandler = new ActivityHandler(service, validator, authService);
    server.route(routes(activityHandler));
  },
};
