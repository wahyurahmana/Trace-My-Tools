const ToolHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'tools',
  version: '1.0.0',
  register: async (server, { service, validator, storage }) => {
    const toolHandler = new ToolHandler(service, validator, storage);
    server.route(routes(toolHandler));
  },
};
