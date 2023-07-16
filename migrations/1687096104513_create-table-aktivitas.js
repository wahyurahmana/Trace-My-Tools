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
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamptz',
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
    bukti_pinjam: {
      type: 'TEXT',
      notNull: true,
    },
    bukti_terima: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('activities');
};
