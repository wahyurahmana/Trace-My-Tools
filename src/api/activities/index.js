const ActivityHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'activities',
  version: '1.0.0',
  register: async (server, {
    service, validator, authService, storage,
  }) => {
    const activityHandler = new ActivityHandler(service, validator, authService, storage);
    server.route(routes(activityHandler));
  },
};
