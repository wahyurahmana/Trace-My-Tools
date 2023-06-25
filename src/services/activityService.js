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
    let result = null;
    // melihat semua daftar aktivitas dari tools yang user login pinjam kepada tim lain
    const queryPeminjam = {
      text: `select activities.*, tools.nama, tools.foto from activities inner join tools on activities.tool_id = tools.id where info -> 'peminjam' ->> 'team' = $1;`,
      values: [teamId]
    };
    // melihat semua daftar aktivitas dari tools yang user memberikan pinjaman tools
    const queryPemberi = {
      text: `select activities.*, tools.nama, tools.foto from activities inner join tools on activities.tool_id = tools.id where info -> 'pemberi' ->> 'team' = $1;`,
      values: [teamId]
    };
    const resultPinjam = await this._pool.query(queryPeminjam);
    const resultPemberi = await this._pool.query(queryPemberi);
    result = {
      listPinjaman: resultPinjam.rows,
      listDipinjam: resultPemberi.rows,
    };
    return result;
  }

  // example for add
  // insert into activities (id, tool_id, quantity, created_at, status, info) values ('test2', 'tool-P42dbGOlI_CSiiv-', 2, '2023-02-02', false, '{"peminjam" : {"team": "team-PeJj8IM0phxzTcHE", "user": "30022171"}, "pemberi" : {"team": "team-SXJjvU9_lRVhO_mj", "user": "30022172"}}');
};
