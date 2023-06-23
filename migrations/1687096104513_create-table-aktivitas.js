/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('activities', {
    id: {
      type: 'VARCHAR(50)',
      notNull: true,
      primaryKey: true,
      unique: true,
    },
    tool_id: {
      type: 'VARCHAR(50)',
      references: 'tools',
      referencesConstraintName: 'fk_tool_id',
    },
    quantity: {
      type: 'INT',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
    },
    status: {
      type: 'BOOLEAN',
      notNull: true,
    },
    info: {
      type: 'JSON',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('activities');
};
