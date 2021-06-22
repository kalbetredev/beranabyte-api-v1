import Joi from "joi";

const usernameJoi = Joi.string().min(3).max(100).required();
const emailJoi = Joi.string()
  .email({
    minDomainSegments: 2,
  })
  .required();

const passwordJoi = Joi.string()
  .min(8)
  .max(30)
  .regex(/[a-zA-Z0-9]{3,30}/)
  .required();

const UserLoginSchema = Joi.object({
  email: emailJoi,
  password: passwordJoi,
});

const UserRegistrationSchema = Joi.object({
  username: usernameJoi,
  email: emailJoi,
  password: passwordJoi,
});

export const validateRegistration = (user: any) => {
  return UserRegistrationSchema.validate(user);
};

export const validateLoginInputs = (user: any) => {
  return UserLoginSchema.validate(user);
};
