import Joi from "joi";

const summaryJoi = Joi.string().min(3).max(100).required();
const emailJoi = Joi.string()
  .email({
    minDomainSegments: 2,
  })
  .required();

const usernameJoi = Joi.string().min(3).max(100);

const BioSchema = Joi.object({
  summary: summaryJoi,
  facebookUsername: usernameJoi,
  telegramUsername: usernameJoi,
  linkedinUserId: usernameJoi,
  gitHubUsername: usernameJoi,
  email: emailJoi,
});

export const validateBio = (bio: any) => {
  return BioSchema.validate(bio);
};
