/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const AuthorizationError = require('../exceptions/AuthenticationError');

module.exports = class AuthService {
  constructor() {
    this._pool = new Pool();
  }

  async isAdmin(idBadge) {
    const query = {
      text: 'select * from users where id_badge = $1 AND status = $2;',
      values: [idBadge, 'hash'],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError('Anda Bukan Admin!');
    }
    return true;
  }

  async isOwnerUser(idBadge) {
    const query = {
      text: 'select * from users where id_badge = $1;',
      values: [idBadge],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError('Anda Bukan Pemilik Data Ini!');
    }
    return true;
  }
};
