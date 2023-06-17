const { TeamPayloadSchema } = require('./schema');
const InvariantError = require('../exceptions/InvariantError');

module.exports = {
  validateTeamPayload: (payload) => {
    const validationResult = TeamPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
