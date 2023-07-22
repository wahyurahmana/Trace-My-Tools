/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

module.exports = class TeamHandler {
  constructor(service, validator, authService, storage, senderWA) {
    this._service = service;
    this._validator = validator;
    this._authService = authService;
    this._storage = storage;
    this._senderWA = senderWA;
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
      const currentStockTool = await this._service.cekAvailableTool(request.payload.toolId, +request.payload.quantity);
      this._validator.validateImageHeadersPayload(request.payload.buktiPinjam.hapi.headers);
      const fileNameBuktiPinjam = await this._storage.writeFile(request.payload.buktiPinjam, request.payload.buktiPinjam.hapi, 'pinjam');
      request.payload.buktiPinjam = `http://${process.env.HOST}:${process.env.PORT}/uploads/img/${fileNameBuktiPinjam}`;
      const result = await this._service.addActivity(request.payload, currentStockTool);
      const response = h.response({
        status: 'success',
        message: `Success Add With ID ${result.id}`,
      });
      response.code(201);
      const peminjam = await this._service.detailUserWithEmail(result.info.peminjam.user);
      const pemberi = await this._service.detailUserWithEmail(result.info.pemberi.user);
      this._senderWA.singleSend(peminjam.no_hp, `Halo ${result.info.peminjam.user}, Anda Saat Ini Sedang Meminjam Alat Di ${pemberi.email}. Jangan Lupa Dikembalikan Sebelum Jam 4 yaa.`);
      this._senderWA.singleSend(pemberi.no_hp, `Halo ${result.info.pemberi.user}, Anda Saat Ini Sedang Meminjamkan Alat Kepada ${peminjam.email}.`);

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
      const {
        status, quantity, toolId,
      } = request.payload;
      await this._authService.ownerPemberiByTeamId(request.params.id, teamId);
      this._validator.validateImageHeadersPayload(request.payload.buktiTerima.hapi.headers);
      const fileNameBuktiTerima = await this._storage.writeFile(request.payload.buktiTerima, request.payload.buktiTerima.hapi, 'terima');
      const buktiTerima = `http://${process.env.HOST}:${process.env.PORT}/uploads/img/${fileNameBuktiTerima}`;
      const idUpdate = await this._service.changeStatus(id, status, buktiTerima, +quantity, toolId);
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

  async getDetailActivityHandler(request, h) {
    try {
      const { id } = request.params;
      const activity = await this._service.detailActivity(id);
      const response = h.response({
        status: 'success',
        data: {
          activity: activity[0],
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
};
