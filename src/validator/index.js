const { CameraPayloadSchema } = require('./schema');

module.exports = {
  validateCameraPayload: (payload) => {
    const validationResult = CameraPayloadSchema.validate(payload);
    if (validationResult.error) {
      // return error
    }
  },
};
