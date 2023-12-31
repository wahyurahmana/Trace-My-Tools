require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const validator = require('./validator');

// API
const teams = require('./api/teams');
const users = require('./api/users');
const tools = require('./api/tools');
const activities = require('./api/activities');

// Service
const tokenManager = require('./utilities/jwt');
const senderWA = require('./utilities/senderWA');
const Storage = require('./utilities/storage');
const TeamService = require('./services/TeamService');
const UserService = require('./services/UserService');
const ToolService = require('./services/ToolService');
const AuthService = require('./services/AuthService');
const ActivityService = require('./services/ActivityService');

const init = async () => {
  // INISIALISASI SERVICE
  const teamService = new TeamService();
  const userService = new UserService();
  const toolService = new ToolService();
  const authService = new AuthService();
  const storage = new Storage(path.resolve(__dirname, 'api/uploads/img'));
  const activityService = new ActivityService();

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
    {
      plugin: Inert,
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
        idUser: artifacts.decoded.payload.idUser,
        teamId: artifacts.decoded.payload.teamId,
      },
    }),
  });

  await server.register([{
    plugin: teams,
    options: {
      service: teamService,
      validator,
      authService,
    },
  }, {
    plugin: users,
    options: {
      service: userService,
      validator,
      tokenManager,
      authService,
      senderWA,
    },
  }, {
    plugin: tools,
    options: {
      service: toolService,
      validator,
      storage,
      authService,
    },
  }, {
    plugin: activities,
    options: {
      service: activityService,
      validator,
      storage,
      authService,
      senderWA,
      toolService,
    },
  }]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
