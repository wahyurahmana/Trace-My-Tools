const {
  TeamPayloadSchema,
  ImageHeadersSchema,
  ToolPayloadSchema,
  RegisterPayloadSchema,
  ChangePassPayloadSchema,
} = require('./schema');
const InvariantError = require('../exceptions/InvariantError');

module.exports = {
  validateTeamPayload: (payload) => {
    const validationResult = TeamPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateImageHeadersPayload: (payload) => {
    const validationResult = ImageHeadersSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateToolPayload: (payload) => {
    const validationResult = ToolPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateRegisterPayload: (payload) => {
    const validationResult = RegisterPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateChangePassPayload: (payload) => {
    const validationResult = ChangePassPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
