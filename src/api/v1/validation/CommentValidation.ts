import Joi from "joi";

const CommentSchema = Joi.object({
  blogId: Joi.string().required(),
  authorId: Joi.string().required(),
  text: Joi.string().required().min(2).max(500),
  date: Joi.date().required(),
});

export const validateComment = (comment: any) => {
  return CommentSchema.validate(comment);
};
