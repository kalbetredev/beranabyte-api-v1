import Joi from "joi";

const requiredStringJoi = Joi.string().min(3).max(100).required();
const stringJoi = Joi.string().min(3).max(500);

const ConfigSchema = Joi.object({
  title: requiredStringJoi,
  summary: requiredStringJoi,
  githubLink: requiredStringJoi,
  tags: stringJoi,
});

export const validateProject = (project: any) => {
  return ConfigSchema.validate(project);
};
