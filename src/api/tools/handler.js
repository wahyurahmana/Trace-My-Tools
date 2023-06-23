/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

module.exports = class ToolHandler {
  constructor(service, validator, storage) {
    this._service = service;
    this._validator = validator;
    this._storage = storage;
  }

  async getToolHandler(request, h) {
    try {
      const tools = await this._service.getAllTool(request.auth.credentials.teamId);
      const response = h.response({
        status: 'success',
        data: {
          tools,
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

  async postToolHandler(request, h) {
    try {
      const {
        nama, foto, stok,
      } = request.payload;
      this._validator.validateToolPayload({ nama, stok });
      this._validator.validateImageHeadersPayload(foto.hapi.headers);
      const fileName = await this._storage.writeFile(foto, foto.hapi);
      const id = await this._service.addTool({
        nama, fileName: `http://${process.env.HOST}:${process.env.PORT}/upload/tools/${fileName}`, stok, teamId: request.auth.credentials.teamId,
      });
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
};
