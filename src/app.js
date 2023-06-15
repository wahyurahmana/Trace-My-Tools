require('dotenv').config();
const Hapi = require('@hapi/hapi');

const validator = require('./validator');

// API
const roles = require('./api/roles');
const teams = require('./api/teams');

// Service
const TeamService = require('./services/TeamService');
const RoleService = require('./services/RoleService');

const init = async () => {
  // INISIALISASI SERVICE
  const teamService = new TeamService();
  const roleService = new RoleService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([{
    plugin: teams,
    options: {
      service: teamService,
      validator,
    },
  }, {
    plugin: roles,
    options: {
      service: roleService,
      validator,
    },
  }]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
