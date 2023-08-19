/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
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
      text: 'select users.*, teams.id as team_id, teams.nama as nama_team from users inner join teams on users.team_id = teams.id where id_user = $1;',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Data Tidak Ditemukan!');
    }
    return result.rows;
  }

  async addUser(data) { // used FE
    try {
      const {
        email, password, noHP, teamId,
      } = data;
      const id = `user-${nanoid(16)}`;
      const hashPassword = bcrypt.hashSync(password, salt);
      const query = {
        text: 'insert into users values ($1, $2, $3, $4, $5, $6) returning id_user;',
        values: [id, email, hashPassword, noHP, 'user', teamId],
      };
      const result = await this._pool.query(query);
      if (!result.rows[0].id_user) {
        throw new InvariantError('Gagal Menambahkan Data!');
      }
      return result.rows[0].id_user;
    } catch (error) {
      if (error.constraint === 'users_pkey') {
        throw new InvariantError('Id User Telah Ada!');
      } else if (error.constraint === 'users_email_key') {
        throw new InvariantError('Email Telah Ada');
      } else if (error.constraint === 'users_no_hp_key') {
        throw new InvariantError('No HP Telah Ada');
      } else {
        throw new InvariantError('Gagal Menambahkan Data!');
      }
    }
  }

  async destroyUser(idUser) {
    const query = {
      text: 'delete from users where id = $1 returning id_user;',
      values: [idUser],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id_user) {
      throw new NotFoundError('Gagal Menghapus Data. Id Tidak Ditemukan!');
    }
    return result.rows[0].id_user;
  }

  async updateUser(idUser, data) {
    try {
      const {
        email, noHP, teamId,
      } = data;
      const query = {
        text: 'update users set id_user = $1, email = $2, no_hp = $3, team_id = $4 where id_user = $5 returning id_user;',
        values: [idUser, email, noHP, teamId, idUser],
      };
      const result = await this._pool.query(query);
      if (!result.rows[0].id_user) {
        throw new NotFoundError('Gagal Mengubah Data. Id Tidak Ditemukan!');
      }
      return result.rows[0].id_user;
    } catch (error) {
      if (error.constraint === 'users_pkey') {
        throw new InvariantError('Id User Telah Ada!');
      }
      return error;
    }
  }

  async changePassword(idUser, data) {
    const { oldPassword, newPassword } = data;
    const user = await this.detailUser(idUser);
    const checkOldPassword = bcrypt.compareSync(oldPassword, user[0].password);
    if (!checkOldPassword) {
      throw new InvariantError('Password Lama Tidak Cocok!');
    }
    const hashPassword = bcrypt.hashSync(newPassword, salt);
    const query = {
      text: 'update users set password = $1 where id_user = $2 returning id_user;',
      values: [hashPassword, idUser],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id_user) {
      throw new InvariantError('Gagal Mengubah Password!');
    }
    return result.rows[0].id_user;
  }

  async checkidUserAndPass({ email, password }) {
    const query = {
      text: 'select * from users where email = $1;',
      values: [email],
    };
    const user = await this._pool.query(query);
    if (!user.rows.length) {
      throw new AuthenticationError('Email/Password Salah!');
    }
    const checkPassword = bcrypt.compareSync(password, user.rows[0].password);
    if (!checkPassword) {
      throw new AuthenticationError('Email/Password Salah!');
    }
    return { idUser: user.rows[0].id_user, teamId: user.rows[0].team_id };
  }

  async getAllEmailWithTeam(teamId) {
    const queryListPeminjam = {
      text: 'select users.id_user, users.email, teams.id as team_id, teams.id as team_id, teams.nama from users inner join teams on users.team_id = teams.id where users.team_id not in ($1);',
      values: [teamId],
    };
    const listPeminjam = await this._pool.query(queryListPeminjam);

    const queryListPemberi = {
      text: 'select users.id_user, users.email, teams.id as team_id, teams.id as team_id, teams.nama from users inner join teams on users.team_id = teams.id where users.team_id in ($1);',
      values: [teamId],
    };
    const listPemberi = await this._pool.query(queryListPemberi);
    const result = {
      listPeminjam: listPeminjam.rows,
      listPemberi: listPemberi.rows,
    };
    return result;
  }

  async checkUserByEmail(email) {
    const query = {
      text: 'select * from users where email = $1;',
      values: [email],
    };
    const user = await this._pool.query(query);
    if (!user.rows.length) {
      throw new NotFoundError('Email Tidak Ditemukan');
    }
    return { idUser: user.rows[0].id_user, teamId: user.rows[0].team_id };
  }
};
