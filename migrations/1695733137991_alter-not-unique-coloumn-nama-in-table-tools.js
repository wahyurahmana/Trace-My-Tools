/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropConstraint('tools', 'tools_nama_key');
};

exports.down = (pgm) => {
  pgm.addConstraint('tools', 'tools_nama_key', {
    unique: ['nama'],
  });
};
