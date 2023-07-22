/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('activities', {
    quantity: {
      type: 'INT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('activities', 'quantity');
};
