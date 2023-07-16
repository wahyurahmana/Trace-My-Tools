/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

module.exports = class TeamHandler {
  constructor(service, validator, authService, storage) {
    this._service = service;
    this._validator = validator;
    this._authService = authService;
    this._storage = storage;
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
      this._validator.validateImageHeadersPayload(request.payload.buktiPinjam.hapi.headers);
      const fileNameBuktiPinjam = await this._storage.writeFile(request.payload.buktiPinjam, request.payload.buktiPinjam.hapi, 'pinjam');
      request.payload.buktiPinjam = `http://${process.env.HOST}:${process.env.PORT}/uploads/img/${fileNameBuktiPinjam}`;
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
      const {
        id,
      } = request.params;
      await this._authService.ownerPemberiByTeamId(request.params.id, teamId);
      this._validator.validateImageHeadersPayload(request.payload.buktiTerima.hapi.headers);
      const fileNameBuktiTerima = await this._storage.writeFile(request.payload.buktiTerima, request.payload.buktiTerima.hapi, 'terima');
      const buktiTerima = `http://${process.env.HOST}:${process.env.PORT}/uploads/img/${fileNameBuktiTerima}`;
      const idUpdate = await this._service.changeStatus(id, request.payload.status, buktiTerima);
      const response = h.response({
        status: 'success',
        message: `Success Update Status ID ${idUpdate}`,
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
