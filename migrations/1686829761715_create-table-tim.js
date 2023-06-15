/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('teams', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      unique: true,
      notNull: true,
    },
    nama: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('teams');
};
