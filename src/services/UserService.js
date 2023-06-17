/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthenticationError = require('../exceptions/AuthenticationError');

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
      throw new NotFoundError('Data Tidak Ditemukan!');
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
      throw new InvariantError('Gagal Menambahkan Data!');
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
      throw new NotFoundError('Gagal Menghapus Data. Id Tidak Ditemukan!');
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
      throw new NotFoundError('Gagal Mengubah Data. Id Tidak Ditemukan!');
    }
    return result.rows[0].id_badge;
  }

  async changePassword(idBadge, data) {
    const { oldPassword, newPassword } = data;
    const user = await this.detailUser(idBadge);
    const checkOldPassword = bcrypt.compareSync(oldPassword, user.rows[0].password);
    if (!checkOldPassword) {
      throw new InvariantError('Password Lama Tidak Cocok!');
    }
    const hashPassword = bcrypt.hashSync(newPassword, salt);
    const query = {
      text: 'update users set password = $1 where id_badge = $2 returning id_badge;',
      values: [hashPassword, idBadge],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id_badge) {
      throw new InvariantError('Gagal Mengubah Password!');
    }
    return result.rows[0].id_badge;
  }

  async checkIdBadgeAndPass({ idBadge, password }) {
    const query = {
      text: 'select * from users where id_badge = $1;',
      values: [idBadge],
    };
    const user = await this._pool.query(query);
    if (!user.rows.length) {
      throw new AuthenticationError('Id Badge/Password Salah!');
    }
    const checkPassword = bcrypt.compareSync(password, user.rows[0].password);
    if (!checkPassword) {
      throw new AuthenticationError('Id Badge/Password Salah!');
    }
    return { idBadge: user.rows[0].id_badge, teamId: user.rows[0].team_id };
  }
};
