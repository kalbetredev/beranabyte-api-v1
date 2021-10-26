import Joi from "joi";

const emailJoi = Joi.string()
  .email({
    minDomainSegments: 2,
  })
  .required();

const SubscriberSchema = Joi.object({
  email: emailJoi,
  date: Joi.date().required(),
});

export const validateSubscriber = (subscriber: any) => {
  return SubscriberSchema.validate(subscriber);
};
