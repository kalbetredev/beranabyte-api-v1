import Joi from "joi";

const emailJoi = Joi.string()
  .email({
    minDomainSegments: 2,
  })
  .required();

const MessageSchema = Joi.object({
  email: emailJoi,
  content: Joi.string().required().min(2).max(500),
  date: Joi.date().required(),
});

export const validateMessage = (message: any) => {
  return MessageSchema.validate(message);
};
