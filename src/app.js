require('dotenv').config();
const Hapi = require('@hapi/hapi');

const validator = require('./validator');

// API
const teams = require('./api/teams');

// Service
const TeamService = require('./services/TeamService');

const init = async () => {
  // INISIALISASI SERVICE
  const teamService = new TeamService();

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
  }]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
