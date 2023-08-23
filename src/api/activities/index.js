const ActivityHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'activities',
  version: '1.0.2',
  register: async (server, {
    service, validator, authService, storage, senderWA, toolService,
  }) => {
    const activityHandler = new ActivityHandler(service, validator, authService, storage, senderWA, toolService);
    server.route(routes(activityHandler));
  },
};
