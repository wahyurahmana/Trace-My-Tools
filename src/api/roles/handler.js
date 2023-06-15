/* eslint-disable no-underscore-dangle */
module.exports = class RoleHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async getRoleHandler(request, h) {
    try {
      const roles = await this._service.getAllRole();
      const response = h.response({
        status: 'success',
        data: {
          roles,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async postRoleHandler(request, h) {
    try {
      // this._validator.validateCameraPayload(request.payload);
      const id = await this._service.addRole(request.payload);
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

  async deleteRoleHandler(request, h) {
    try {
      const id = await this._service.deleteRole(request.params.id);
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

  async putRoleHandler(request, h) {
    try {
      // this._validator.validateCameraPayload(request.payload);
      const id = await this._service.editRole(request.params.id, request.payload);
      const response = h.response({
        status: 'success',
        message: `Success Edit ID ${id}`,
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async detailRoleHandler(request, h) {
    try {
      const role = await this._service.detailRole(request.params.id);
      const response = h.response({
        status: 'success',
        data: {
          role,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};
