/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');

module.exports = class RoleService {
  constructor() {
    this._pool = new Pool();
  }

  async getAllRole() {
    const query = {
      text: 'SELECT * FROM roles;',
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async addRole(data) {
    const id = `role-${nanoid(16)}`;
    const { nama } = data;
    const query = {
      text: 'INSERT INTO roles VALUES ($1, $2) returning id;',
      values: [id, nama],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      // error tidak berhasil ditambah dalam database
    }
    return result.rows[0].id;
  }

  async deleteRole(id) {
    const query = {
      text: 'DELETE FROM roles WHERE id = $1 returning id;',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      // error data tidak ditemukan
    }
    return result.rows[0].id;
  }

  async editRole(id, data) {
    const query = {
      text: 'UPDATE roles SET nama = $1, WHERE id = $2 returning id',
      values: [data.nama, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      // error jika tidak ditemukan
    }
    return result.rows[0].id;
  }

  async detailRole(id) {
    const query = {
      text: 'SELECT * FROM roles WHERE id = $1;',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      // error jika tidak ditemukan
    }
    return result.rows[0];
  }
};
