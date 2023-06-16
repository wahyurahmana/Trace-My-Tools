/* eslint-disable no-underscore-dangle */
module.exports = class UserHandler {
  constructor(service, validator, tokenManager) {
    this._service = service;
    this._validator = validator;
    this._tokenManager = tokenManager;
  }

  async getUserHandler(request, h) {
    try {
      // hanya admin yang bisa lihat daftar semua user
      const users = await this._service.allUsers();
      const response = h.response({
        status: 'success',
        data: {
          users,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async detailUserHandler(request, h) {
    try {
      // admin bisa lihat semua detail user atau
      // params idBadge hrs sama dgn user yang login
      const user = await this._service.detailUser(request.params.idBadge);
      const response = h.response({
        status: 'success',
        data: {
          user: user[0],
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async postUserHandler(request, h) {
    try {
      // validasi inputan terlebih dahulu
      const id = await this._service.addUser(request.payload);
      const response = h.response({
        status: 'success',
        message: `Success Add ${request.payload.email} With ID ${id}`,
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteUserHandler(request, h) {
    try {
      // hanya admin yang bisa hapus user
      const id = await this._service.destroyUser(request.params.idBadge);
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

  async putUserHandler(request, h) {
    try {
      // hanya admin yang bisa mengubah user atau
      // params idBadge hrs sama dgn user yang login
      // validasi inputan
      const id = await this._service.updateUser(request.params.id, request.payload);
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

  async putPasswordUserHandler(request, h) {
    try {
      // hanya pemilik login yg bisa update password
      // validasi inputan
      await this._service.changePassword('idYangLogin', request.payload);
      const response = h.response({
        status: 'success',
        message: 'Success Edit Password',
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async loginHandler(request, h) {
    try {
      const payload = await this._service.checkIdBadgeAndPass(request.payload);
      const token = this._tokenManager.generate(payload);
      const response = h.response({
        status: 'success',
        token,
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};
