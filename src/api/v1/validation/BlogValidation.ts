import Joi from "joi";

const BlogSchema = Joi.object({
  title: Joi.string().required().min(5),
  category: Joi.string().required().min(3),
  publishedAt: Joi.date().required(),
  summary: Joi.string().required(),
  imageUrl: Joi.string().required(),
  viewCount: Joi.number().positive(),
  mdx: Joi.string().required().min(500),
});

export const validateBlog = (blog: any) => {
  return BlogSchema.validate(blog);
};
