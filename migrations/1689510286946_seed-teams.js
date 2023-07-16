/* eslint-disable camelcase */
const { nanoid } = require('nanoid');

exports.shorthands = undefined;
const id = `team-${nanoid(16)}`;

exports.up = (pgm) => {
  pgm.sql(`INSERT INTO teams VALUES ('${id}', 'CCTV') returning id;`);
};

exports.down = (pgm) => {
  pgm.sql('DELETE FROM teams;');
};
