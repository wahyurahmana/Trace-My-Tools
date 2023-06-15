/* eslint-disable no-underscore-dangle */
module.exports = class TeamHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async getTeamHandler(request, h) {
    try {
      const teams = await this._service.getAllTeam();
      const response = h.response({
        status: 'success',
        data: {
          teams,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async postTeamHandler(request, h) {
    try {
      // this._validator.validateCameraPayload(request.payload);
      const id = await this._service.addTeam(request.payload);
      const response = h.response({
        status: 'success',
        message: `Success Add ${request.payload.nama} With ID ${id}`,
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteTeamHandler(request, h) {
    try {
      const id = await this._service.deleteTeam(request.params.id);
      const response = h.response({
        status: 'success',
        message: `Success Delete ID ${id}`,
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async putTeamHandler(request, h) {
    try {
      // this._validator.validateCameraPayload(request.payload);
      const id = await this._service.editTeam(request.params.id, request.payload);
      const response = h.response({
        status: 'success',
        message: `Success Edit ID ${id}`,
      });
      response.code(200);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async detailTeamHandler(request, h) {
    try {
      const team = await this._service.detailTeam(request.params.id);
      const response = h.response({
        status: 'success',
        data: {
          team,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};
