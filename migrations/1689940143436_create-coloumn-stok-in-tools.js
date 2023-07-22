/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('tools', {
    stock: {
      type: 'INT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('tools', 'stock');
};
