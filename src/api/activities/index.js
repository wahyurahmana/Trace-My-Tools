const ActivityHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'activities',
  version: '1.0.0',
  register: async (server, {
    service, validator, authService, storage, senderWA,
  }) => {
    const activityHandler = new ActivityHandler(service, validator, authService, storage, senderWA);
    server.route(routes(activityHandler));
  },
};
