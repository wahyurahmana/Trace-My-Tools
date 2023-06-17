require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const validator = require('./validator');

// API
const teams = require('./api/teams');
const users = require('./api/users');

// Service
const tokenManager = require('./utilities/jwt');
const TeamService = require('./services/TeamService');
const UserService = require('./services/UserService');

const init = async () => {
  // INISIALISASI SERVICE
  const teamService = new TeamService();
  const userService = new UserService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('app_jwt', 'jwt', {
    keys: process.env.JWT_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        idBadge: artifacts.decoded.payload.idBadge,
        teamId: artifacts.decoded.payload.teamId,
      },
    }),
  });

  await server.register([{
    plugin: teams,
    options: {
      service: teamService,
      validator,
    },
  }, {
    plugin: users,
    options: {
      service: userService,
      validator,
      tokenManager,
    },
  }]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
