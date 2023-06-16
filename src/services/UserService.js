/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(12);

module.exports = class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async allUsers() {
    const query = {
      text: 'select users.*, teams.nama as nama_team from users inner join teams on users.team_id = teams.id;',
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async detailUser(id) {
    const query = {
      text: 'select users.*, teams.nama as nama_team from users inner join teams on users.team_id = teams.id where id_badge = $1;',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      // error jika tidak ditemukan
    }
    return result.rows;
  }

  async addUser(data) {
    const {
      idBadge, email, password, noHP, teamId,
    } = data;
    const hashPassword = bcrypt.hashSync(password, salt);
    const query = {
      text: 'insert into users values ($1, $2, $3, $4, $5, $6) returning id_badge;',
      values: [idBadge, email, hashPassword, noHP, 'user', teamId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id_badge) {
      // error jika gagal input
    }
    return result.rows[0].id_badge;
  }

  async destroyUser(idBadge) {
    const query = {
      text: 'delete from users where id = $1 returning id_badge;',
      values: [idBadge],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id_badge) {
      // error jika gagal input
    }
    return result.rows[0].id_badge;
  }

  async updateUser(idBadge, data) {
    const {
      email, noHP, status, teamId,
    } = data;
    const query = {
      text: 'update users set email = $1, no_hp = $2, status = $3, team_id = $4 where id_badge = $5 returning id_badge;',
      values: [email, noHP, status, teamId, idBadge],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id_badge) {
      // error jika gagal input
    }
    return result.rows[0].id_badge;
  }

  async changePassword(idBadge, data) {
    const { oldPassword, newPassword } = data;
    const user = await this.detailUser(idBadge);
    const checkOldPassword = bcrypt.compareSync(oldPassword, user.rows[0].password);
    if (!checkOldPassword) {
      // error jika password lama yang di input tidak cocok dengan data password di db
    }
    const hashPassword = bcrypt.hashSync(newPassword, salt);
    const query = {
      text: 'update users set password = $1 where id_badge = $2 returning id_badge;',
      values: [hashPassword, idBadge],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id_badge) {
      // error jika gagal input
    }
    return result.rows[0].id_badge;
  }

  async checkIdBadgeAndPass({ idBadge, password }) {
    const user = await this.detailUser(idBadge);
    if (!user.length) {
      // return jika user tidak ditemukan
    }
    const checkPassword = bcrypt.compareSync(password, user[0].password);
    if (!checkPassword) {
      // return jika password tidak cocok dengan db
    }
    return { idBadge: user[0].id_badge, teamId: user[0].team_id };
  }
};
