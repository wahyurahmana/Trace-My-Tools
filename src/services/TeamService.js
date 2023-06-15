/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');

module.exports = class TeamService {
  constructor() {
    this._pool = new Pool();
  }

  async getAllTeam() {
    const query = {
      text: 'SELECT * FROM teams;',
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async addTeam(data) {
    const id = `team-${nanoid(16)}`;
    const { nama } = data;
    const query = {
      text: 'INSERT INTO teams VALUES ($1, $2) returning id;',
      values: [id, nama],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      // error tidak berhasil ditambah dalam database
    }
    return result.rows[0].id;
  }

  async deleteTeam(id) {
    const query = {
      text: 'DELETE FROM teams WHERE id = $1 returning id;',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      // error data tidak ditemukan
    }
    return result.rows[0].id;
  }

  async editTeam(id, data) {
    const query = {
      text: 'UPDATE teams SET nama = $1, WHERE id = $2 returning id',
      values: [data.nama, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      // error jika tidak ditemukan
    }
    return result.rows[0].id;
  }

  async detailTeam(id) {
    const query = {
      text: 'SELECT * FROM teams WHERE id = $1;',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      // error jika tidak ditemukan
    }
    return result.rows[0];
  }
};
