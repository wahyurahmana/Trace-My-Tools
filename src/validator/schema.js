const Joi = require('joi');

const CameraPayloadSchema = Joi.object({
  nama: Joi.string().required(),
  ipAddress: Joi.string().required(),
  modelId: Joi.string().required(),
  fitur: Joi.string(),
  macAddress: Joi.string().required(),
  serialNumber: Joi.string().required(),
  firmware: Joi.string(),
  resolusi: Joi.string(),
  autentikasi: Joi.string().required(),
});

const BrandPayloadSchema = Joi.object({
  nama: Joi.string().required(),
});

const ModelPayloadSchema = Joi.object({
  nama: Joi.string().required(),
  brandId: Joi.string(),
});

module.exports = {
  CameraPayloadSchema,
  BrandPayloadSchema,
  ModelPayloadSchema,
};
