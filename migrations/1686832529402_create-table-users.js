/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id_badge: {
      type: 'VARCHAR(20)',
      notNull: true,
      primaryKey: true,
      unique: true,
    },
    email: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    no_hp: {
      type: 'VARCHAR(20)',
      notNull: true,
      unique: true,
    },
    status: {
      type: 'VARCHAR(10)',
      notNull: true,
    },
    team_id: {
      type: 'VARCHAR(50)',
      references: 'teams',
      referencesConstraintName: 'fk_team_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
