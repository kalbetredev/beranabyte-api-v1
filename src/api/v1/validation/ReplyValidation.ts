import Joi from "joi";

const ReplySchema = Joi.object({
  commentId: Joi.string().required(),
  authorId: Joi.string().required(),
  text: Joi.string().required().min(2).max(500),
  date: Joi.date().required(),
});

export const validateReply = (reply: any) => {
  return ReplySchema.validate(reply);
};
