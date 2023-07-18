/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

module.exports = class UserHandler {
  constructor(service, validator, tokenManager, authService) {
    this._service = service;
    this._validator = validator;
    this._tokenManager = tokenManager;
    this._authService = authService;
  }

  async getUserHandler(request, h) {
    try {
      await this._authService.isAdmin(request.auth.credentials.idUser);
      const users = await this._service.allUsers();
      const response = h.response({
        status: 'success',
        data: {
          users,
        },
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async detailUserHandler(request, h) {
    try {
      await this._authService.isOwnerUser(request.auth.credentials.idUser);
      const user = await this._service.detailUser(request.params.idUser);
      const response = h.response({
        status: 'success',
        data: {
          user: user[0],
        },
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateRegisterPayload(request.payload);
      const id = await this._service.addUser(request.payload);
      const response = h.response({
        status: 'success',
        message: `Success Add ${request.payload.email} With ID ${id}`,
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteUserHandler(request, h) {
    try {
      await this._authService.isAdmin(request.auth.credentials.idUser);
      const id = await this._service.destroyUser(request.params.idUser);
      const response = h.response({
        status: 'success',
        message: `Success Delete ID ${id}`,
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putUserHandler(request, h) {
    try {
      await this._validator.validateUpdateUserPayload(request.payload);
      await this._authService.isOwnerUser(request.auth.credentials.idUser, request.params.idUser);
      const id = await this._service.updateUser(request.auth.credentials.idUser, request.payload);
      const response = h.response({
        status: 'success',
        message: `Success Edit ID ${id}`,
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putPasswordUserHandler(request, h) {
    try {
      await this._validator.validateChangePassPayload(request.payload);
      await this._service.changePassword(request.auth.credentials.idUser, request.payload);
      const response = h.response({
        status: 'success',
        message: 'Success Edit Password',
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async loginHandler(request, h) {
    try {
      const payload = await this._service.checkidUserAndPass(request.payload);
      const token = this._tokenManager.generate(payload);
      const response = h.response({
        status: 'success',
        token,
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAllEmailWithTeamHandler(request, h) {
    try {
      const users = await this._service.getAllEmailWithTeam(request.auth.credentials.teamId);
      const response = h.response({
        status: 'success',
        data: users,
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
};
