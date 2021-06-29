import Joi from "joi";

const configKeyJoi = Joi.string().min(3).max(100).required();
const configValueJoi = Joi.string().min(3).max(500).required();

const ConfigSchema = Joi.object({
  key: configKeyJoi,
  value: configValueJoi,
});

export const validateConfig = (config: any) => {
  return ConfigSchema.validate(config);
};
