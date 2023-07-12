/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('tools', {
    id: {
      type: 'VARCHAR(50)',
      notNull: true,
      primaryKey: true,
      unique: true,
    },
    nama: {
      type: 'VARCHAR(20)',
      notNull: true,
      unique: true,
    },
    foto: {
      type: 'TEXT',
    },
    team_id: {
      type: 'VARCHAR(50)',
      references: 'teams',
      referencesConstraintName: 'fk_team_id',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('tools');
};
