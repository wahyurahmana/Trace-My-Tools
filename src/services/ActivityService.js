/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const moment = require('moment-timezone');

module.exports = class ActivityService {
  constructor() {
    moment.tz.setDefault("Asia/Makassar");
    this._pool = new Pool();
  }

  async getAllActivity(teamId) {
    // melihat semua daftar aktivitas dari tools yang user login pinjam kepada tim lain
    const queryPinjam = {
      text: 'select activities.*, tools.nama, tools.foto, teams.nama as nama_team from activities inner join tools on activities.tool_id = tools.id inner join teams on tools.team_id = teams.id where activities.info -> $1 ->> $2 = $3 ORDER BY activities.status;',
      values: ['peminjam', 'team', teamId],
    };
    // melihat semua daftar aktivitas dari tools yang user memberikan pinjaman tools
    const queryPemberi = {
      text: 'select activities.*, tools.nama, tools.foto from activities inner join tools on activities.tool_id = tools.id where activities.info -> $1 ->> $2 = $3 ORDER BY activities.status;',
      values: ['pemberi', 'team', teamId],
    };
    const resultPinjam = await this._pool.query(queryPinjam);
    const resultPemberi = await this._pool.query(queryPemberi);
    const result = {
      listPinjaman: resultPinjam.rows.map((el) => {
        el.created_at = moment(el.created_at, 'Asia/Makassar').format();
        return el;
      }),
      listDipinjam: resultPemberi.rows.map((el) => {
        el.created_at = moment(el.created_at, 'Asia/Makassar').format();
        return el;
      }),
    };
    return result;
  }

  async addActivity(data, currentStockTool) {
    try {
      await this._pool.query('BEGIN');
      const id = nanoid(16);
      const {
        toolId,
        createdAt,
        peminjamEmail, teamPeminjam, pemberiEmail, teamPemberi,
        buktiPinjam,
        quantity,
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
      const queryUpdateStockTool = {
        text: 'update tools set stock = $1 where id = $2;',
        values: [currentStockTool - (+quantity), toolId],
      };
      await this._pool.query(queryUpdateStockTool);
      const query = {
        text: 'insert into activities (id, tool_id, created_at, status, info, bukti_pinjam, quantity) values ($1, $2, $3, $4, $5, $6, $7) returning *;',
        values: [id, toolId, createdAt, false, JSON.stringify(info), buktiPinjam, quantity],
      };
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        await this._pool.query('ROLLBACK');
        throw new InvariantError('Gagal Menambahkan Data!');
      }
      await this._pool.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await this._pool.query('ROLLBACK');
      return error;
    }
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

  async changeStatus(idActivity, status, buktiTerima, quantity, toolId) {
    try {
      await this._pool.query('BEGIN');

      const queryCurrentStockTool = {
        text: 'select * from tools where id = $1',
        values: [toolId],
      };
      const currentStockTool = await this._pool.query(queryCurrentStockTool);
      const queryUpdateStockTool = {
        text: 'update tools set stock = $1 where id = $2;',
        values: [currentStockTool.rows[0].stock + (+quantity), toolId],
      };
      await this._pool.query(queryUpdateStockTool);

      const query = {
        text: 'UPDATE activities SET status = $1, bukti_terima = $2 WHERE id = $3 returning id;',
        values: [status, buktiTerima, idActivity],
      };
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Gagal Mengubah Data. Id Tidak Ditemukan!');
      }
      await this._pool.query('COMMIT');
      return result.rows[0].id;
    } catch (error) {
      await this._pool.query('ROLLBACK');
      return error;
    }
  }

  async cekAvailableTool(toolId, quantity) {
    const query = {
      text: 'select * from tools where id = $1;',
      values: [toolId],
    };
    const result = await this._pool.query(query);
    if (quantity <= 0) {
      throw new InvariantError('Perhatikan Jumlah');
    }
    if (result.rows.length) {
      if (quantity > result.rows[0].stock) {
        throw new InvariantError('Stock Alat Kurang');
      }
      return +result.rows[0].stock;
    }
    throw new NotFoundError('Data Tidak Ditemukan!');
  }

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

  async detailActivity(idActivity) {
    const query = {
      text: 'select activities.*, tools.nama, tools.foto from activities inner join tools on activities.tool_id = tools.id where activities.id = $1;',
      values: [idActivity],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Data Tidak Ditemukan!');
    }
    const activity = result.rows.map((el) => {
      el.created_at = moment(el.created_at, 'Asia/Makassar').format();
      return el;
    });
    return activity;
  }
};
