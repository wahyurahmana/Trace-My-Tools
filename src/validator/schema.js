const Joi = require('joi');

const TeamPayloadSchema = Joi.object({
  nama: Joi.string().required(),
});

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/jpg', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

const ToolPayloadSchema = Joi.object({
  nama: Joi.string().required(),
});

const RegisterPayloadSchema = Joi.object({
  idBadge: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
  noHP: Joi.string().required(),
  teamId: Joi.string().required(),
});

const ChangePassPayloadSchema = Joi.object({
  oldPassword: Joi.string().min(8).max(16).required(),
  newPassword: Joi.string().min(8).max(16).required(),
});

const UpdateUserPayloadSchema = Joi.object({
  idBadge: Joi.string().required(),
  email: Joi.string().email().required(),
  noHP: Joi.string().required(),
  teamId: Joi.string().required(),
});

module.exports = {
  TeamPayloadSchema,
  ImageHeadersSchema,
  ToolPayloadSchema,
  RegisterPayloadSchema,
  ChangePassPayloadSchema,
  UpdateUserPayloadSchema,
};
