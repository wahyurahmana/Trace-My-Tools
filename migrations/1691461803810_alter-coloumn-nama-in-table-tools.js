/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('tools', 'nama', {
    type: 'VARCHAR(50)',
    notNull: true,
    unique: true,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('tools', 'nama', {
    type: 'VARCHAR(20)',
    notNull: true,
    unique: true,
  });
};
