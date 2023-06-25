/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

module.exports = class ToolService {
  constructor() {
    this._pool = new Pool();
  }

  async getAllTool(teamId) {
    const query = {
      text: 'SELECT tools.*, teams.nama FROM tools INNER JOIN teams ON tools.team_id = teams.id WHERE tools.team_id = $1;',
      values: [teamId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async addTool(data) {
    const id = `tool-${nanoid(16)}`;
    const {
      nama, fileName, stok, teamId,
    } = data;
    const query = {
      text: 'INSERT INTO tools VALUES ($1, $2, $3, $4, $5) returning id;',
      values: [id, nama, fileName, stok, teamId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal Menambahkan Data!');
    }
    return result.rows[0].id;
  }

  async deleteTool(id) {
    const query = {
      text: 'DELETE FROM tools WHERE id = $1 returning id;',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal Menghapus Data. Id Tidak Ditemukan!');
    }
    return result.rows[0].id;
  }

  async editTool(id, data) {
    const {
      nama, fileName, stok,
    } = data;
    const query = {
      text: 'UPDATE tools SET nama = $1, foto = $2, stok = $3 WHERE id = $4 returning id',
      values: [nama, fileName, stok, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal Mengubah Data. Id Tidak Ditemukan!');
    }
    return result.rows[0].id;
  }

  async detailTool(idTool) {
    const query = {
      text: 'SELECT tools.*, teams.id as team_id, teams.nama as nama_team FROM tools INNER JOIN teams ON tools.team_id = teams.id WHERE tools.id =$1;',
      values: [idTool],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Data Tidak Ditemukan!');
    }
    return result.rows;
  }
};