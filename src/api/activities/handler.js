/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

module.exports = class TeamHandler {
  constructor(service, validator, authService) {
    this._service = service;
    this._validator = validator;
    this._authService = authService;
  }

  async getActivityHandler(request, h) {
    try {
      const data = await this._service.getAllActivity(request.auth.credentials.teamId);
      const response = h.response({
        status: 'success',
        data,
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

  async postActivityHandler(request, h) {
    try {
      // this._validator.validateTeamPayload(request.payload);
      const id = await this._service.addActivity(request.payload);
      const response = h.response({
        status: 'success',
        message: `Success Add ${request.payload.nama} With ID ${id}`,
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

  async deleteActivityHandler(request, h) {
    try {
      const {
        teamId,
      } = request.auth.credentials;
      await this._authService.ownerPemberiByTeamId(request.params.id, teamId);
      const id = await this._service.deleteActivity(request.params.id);
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

  async patchActivityChangeStatusHandler(request, h) {
    try {
      const {
        teamId,
      } = request.auth.credentials;
      await this._authService.ownerPemberiByTeamId(request.params.id, teamId);
      const id = await this._service.changeStatus(request.params.id, request.payload.status);
      const response = h.response({
        status: 'success',
        message: `Success Update Status ID ${id}`,
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
