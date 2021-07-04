import Joi from "joi";

const BlogSchema = Joi.object({
  title: Joi.string().required().min(5),
  category: Joi.string().required().min(3),
  isFeatured: Joi.boolean(),
  isPublished: Joi.boolean().required(),
  publishedAt: Joi.date().required(),
  summary: Joi.string().required(),
  imageUrl: Joi.string().required(),
  viewCount: Joi.number().positive(),
  mdx: Joi.string().required().min(500),
});

const unPublishedBlogSchema = Joi.object({
  title: Joi.string().required().min(5),
  category: Joi.string().required().min(3),
  isFeatured: Joi.boolean(),
  isPublished: Joi.boolean().required(),
  publishedAt: Joi.date(),
  summary: Joi.string(),
  imageUrl: Joi.string(),
  viewCount: Joi.number().positive(),
  mdx: Joi.string(),
});

export const validateBlog = (blog: any) => {
  return BlogSchema.validate(blog);
};

export const validateUnpublishedBlog = (blog: any) => {
  return unPublishedBlogSchema.validate(blog);
};
