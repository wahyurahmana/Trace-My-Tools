/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

module.exports = class ActivityService {
  constructor() {
    this._pool = new Pool();
  }

  async getAllActivity(teamId) {
    // melihat semua daftar aktivitas dari tools yang user login pinjam kepada tim lain
    const queryPinjam = {
      text: 'select activities.*, tools.nama, tools.foto from activities inner join tools on activities.tool_id = tools.id where info -> $1 ->> $2 = $3 ORDER BY activities.id DESC;',
      values: ['peminjam', 'team', teamId],
    };
    // melihat semua daftar aktivitas dari tools yang user memberikan pinjaman tools
    const queryPemberi = {
      text: 'select activities.*, tools.nama, tools.foto from activities inner join tools on activities.tool_id = tools.id where info -> $1 ->> $2 = $3 ORDER BY activities.id DESC;',
      values: ['pemberi', 'team', teamId],
    };
    const resultPinjam = await this._pool.query(queryPinjam);
    const resultPemberi = await this._pool.query(queryPemberi);
    const result = {
      listPinjaman: resultPinjam.rows,
      listDipinjam: resultPemberi.rows,
    };
    return result;
  }

  async addActivity(data) {
    const id = nanoid(16);
    const {
      toolId, createdAt, peminjamEmail, teamPeminjam, pemberiEmail, teamPemberi, buktiPinjam,
    } = data;
    const info = {
      peminjam: {
        team: teamPeminjam,
        user: peminjamEmail,
      },
      pemberi: {
        team: teamPemberi,
        user: pemberiEmail,
      },
    };
    const query = {
      text: 'insert into activities (id, tool_id, created_at, status, info, bukti_pinjam) values ($1, $2, $3, $4, $5, $6) returning *;',
      values: [id, toolId, createdAt, false, JSON.stringify(info), buktiPinjam],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal Menambahkan Data!');
    }
    return result.rows[0];
  }

  async deleteActivity(id) {
    const query = {
      text: 'DELETE FROM activities WHERE id = $1 returning id;',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal Menghapus Data. Id Tidak Ditemukan!');
    }
    return result.rows[0].id;
  }

  async changeStatus(idActivity, status, buktiTerima) {
    const query = {
      text: 'UPDATE activities SET status = $1, bukti_terima = $2 WHERE id = $3 returning id;',
      values: [status, buktiTerima, idActivity],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal Mengubah Data. Id Tidak Ditemukan!');
    }
    return result.rows[0].id;
  }

  async cekStatusToolId(toolId) {
    const query = {
      text: 'select * from activities where status = false and tool_id = $1;',
      values: [toolId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length) {
      throw new InvariantError('Alat Masih Dipinjam!');
    }
    return true;
  }

  // redundan dengan detail user di user service
  async detailUserWithEmail(email) {
    const query = {
      text: 'select * from users where email = $1;',
      values: [email],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Data Tidak Ditemukan!');
    }
    return result.rows[0];
  }

  // example for add
  // insert into activities (id, tool_id, quantity, created_at, status, info)
  // values ('test2', 'tool-P42dbGOlI_CSiiv-', 2, '2023-02-02', false,
  // '{"peminjam" : {"team": "team-PeJj8IM0phxzTcHE", "user": "30022171"},
  // "pemberi" : {"team": "team-SXJjvU9_lRVhO_mj", "user": "30022172"}}');
};
