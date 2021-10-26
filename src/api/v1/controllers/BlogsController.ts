import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import ApiError from "../models/ApiError";
import BlogModel, { Blog } from "../models/Blog";
import User from "../models/User";
import { ADMIN_ROLE, WRITER_ROLE } from "../models/UserRoles";
import {
  validateBlog,
  validateUnpublishedBlog,
} from "../validation/BlogValidation";
import { MongoError } from "mongodb";
import BlogImageModel from "../models/BlogImage";

export const getPublishedBlogs = (req: Request, res: Response) => {
  const category = req.query.category;

  let filter = {};
  if (category) {
    filter = {
      category: { $regex: `^${category}$`, $options: "i" },
    };
  }

  BlogModel.find({ ...filter, isPublished: true })
    .select("-mdx -isPublished")
    .then((blogs: any) => {
      return res.status(200).json({
        success: true,
        blogs,
      });
    })
    .catch((error: any) => {
      return res.status(400).json({
        success: false,
        msg: "Unknown Error Ocurred getting the requested Blog",
      });
    });
};

export const getAllUserBlogs = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId)
      throw new ApiError(400, "Error Occurred Verifying Your Account");

    const blogs: Blog[] = await BlogModel.find({ authorId: userId }).select(
      "-mdx"
    );

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(error.status).json({
        success: false,
        msg: error.message,
      });

    return res.status(500).json({
      success: false,
      msg: "Error Occurred Getting All Your Blogs",
    });
  }
};

export const createNewBlog = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId)
      throw new ApiError(400, "Error Occurred Verifying Your Account");

    const user = await User.findById(userId);

    if (user && (user.role === WRITER_ROLE || user.role === ADMIN_ROLE)) {
      const { title, category } = req.body;
      const blog = {
        authorId: user._id.toString(),
        title,
        category,
        isPublished: false,
        lastModifiedAt: new Date(),
      };

      const isValid = validateUnpublishedBlog(blog);
      if (isValid.error) throw new ApiError(400, "Invalid Inputs");

      const newBlog = new BlogModel(blog);
      const savedBlog = await newBlog.save();

      return res.status(200).json({
        success: true,
        blog: savedBlog,
      });
    } else
      throw new ApiError(401, "Your unauthorized to access this API end point");
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(error.status).json({
        success: false,
        msg: error.message,
      });
    else if (error instanceof MongoError && error.code == 11000) {
      return res.status(400).json({
        success: false,
        msg: "The title of your blog is already taken.",
      });
    }

    return res.status(500).json({
      success: false,
      msg: "Error Occurred Creating Your Blog",
    });
  }
};

export const saveBlog = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId)
      throw new ApiError(400, "Error Occurred Verifying Your Account");

    const user = await User.findById(userId);
    if (user && (user.role === WRITER_ROLE || user.role === ADMIN_ROLE)) {
      const blogId = req.params.blogId;
      const { title, category, summary, imageUrl, mdx } = req.body;
      if (!isValidObjectId(blogId)) throw new ApiError(400, "Invalid Blog Id");

      const blog = await BlogModel.findOne({ _id: blogId });
      if (blog) {
        if (blog.authorId !== user._id.toString())
          throw new ApiError(
            401,
            "You don't have sufficient rights to perform this action"
          );

        blog.title = title;
        blog.topic = category;
        blog.summary = summary ?? "";
        blog.imageUrl = imageUrl ?? "";
        blog.content = mdx ?? "";
        blog.lastModifiedOn = new Date();

        const isValid = validateUnpublishedBlog({
          authorId: blog.authorId,
          title: blog.title,
          category: blog.topic,
          isPublished: blog.isPublished,
          lastModifiedAt: blog.lastModifiedOn,
        });

        if (isValid.error) throw new ApiError(400, "Invalid Inputs");

        await blog.save();
        return res.status(200).json({
          success: true,
          msg: "Blog Saved",
        });
      } else throw new ApiError(404, "Blog Not Found");
    } else
      throw new ApiError(401, "Your unauthorized to access this API end point");
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(error.status).json({
        success: false,
        msg: error.message,
      });
    else if (error instanceof MongoError && error.code == 11000) {
      return res.status(400).json({
        success: false,
        msg: "The title of your blog is already taken.",
      });
    }
    return res.status(500).json({
      success: false,
      msg: "Error Occurred Saving Your Blog",
    });
  }
};

export const publishBlog = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId)
      throw new ApiError(400, "Error Occurred Verifying Your Account");

    const user = await User.findById(userId);
    if (user && (user.role === WRITER_ROLE || user.role === ADMIN_ROLE)) {
      const blogId = req.params.blogId;
      if (!isValidObjectId(blogId)) throw new ApiError(400, "Invalid Blog Id");

      const blog = await BlogModel.findOne({ _id: blogId });
      if (blog) {
        if (blog.authorId !== user._id.toString())
          throw new ApiError(
            401,
            "You don't have sufficient rights to perform this action"
          );

        blog.isPublished = true;
        blog.lastModifiedOn = new Date();
        blog.publishedOn = blog.lastModifiedOn;

        const isValid = validateBlog({
          authorId: blog.authorId,
          title: blog.title,
          category: blog.topic,
          isPublished: blog.isPublished,
          publishedAt: blog.publishedOn,
          lastModifiedAt: blog.lastModifiedOn,
          summary: blog.summary,
          imageUrl: blog.imageUrl,
          viewCount: blog.viewCount,
          mdx: blog.content,
        });

        if (isValid.error) throw new ApiError(400, "Invalid Inputs");

        await blog.save();
        return res.status(200).json({
          success: true,
          msg: "Blog Published",
        });
      } else throw new ApiError(404, "Blog Not Found");
    } else
      throw new ApiError(401, "Your unauthorized to access this API end point");
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(error.status).json({
        success: false,
        msg: error.message,
      });

    return res.status(500).json({
      success: false,
      msg: "Error Occurred Publishing Your Blog",
    });
  }
};

export const deleteBlog = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId)
      throw new ApiError(400, "Error Occurred Verifying Your Account");

    const user = await User.findById(userId);

    if (user) {
      const blogId = req.params.blogId;
      const blog = await BlogModel.findOne({ _id: blogId });

      if (blog) {
        if (user.role === ADMIN_ROLE || blog.authorId === user._id.toString()) {
          BlogImageModel.deleteMany(
            { blogId: blogId, userId: blog.authorId },
            (error: any) => {
              if (error) throw new ApiError(500, "Blog Could Not be Deleted");
            }
          );
          BlogModel.deleteOne({ _id: blogId }, (error: any) => {
            if (error) throw new ApiError(500, "Blog Could Not be Deleted");
            res.status(200).json({
              success: true,
              msg: "Blog Deleted Successfully",
            });
          });
        } else
          throw new ApiError(
            401,
            "You don't have sufficient rights to perform this action"
          );
      } else throw new ApiError(404, "Blog Not Found");
    } else
      throw new ApiError(401, "Your unauthorized to access this API end point");
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(error.status).json({
        success: false,
        msg: error.message,
      });
    return res.status(500).json({
      success: false,
      msg: "Error Occurred Creating Your Blog",
    });
  }
};

export const getTopics = async (req: Request, res: Response) => {
  BlogModel.find({ isPublished: true }).then((blogs: any) => {
    if (!blogs) {
      return res.status(400).json({
        success: false,
        msg: "No Blogs Found",
      });
    }

    const topics = new Set();
    blogs.map((blog: any) => topics.add(blog.topic.toLowerCase()));

    return res.status(200).json({
      success: true,
      topics: Array.from(topics),
    });
  });
};

export const getBlog = (req: Request, res: Response) => {
  const blogId = req.params.blogId;

  if (!isValidObjectId(blogId))
    return res.status(400).json({
      success: false,
      msg: "Invalid Blog Id",
    });

  BlogModel.findOne({ _id: blogId, isPublished: true }).then((blog: any) => {
    if (!blog) {
      return res.status(400).json({
        success: false,
        msg: "Blog does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      blog: blog,
    });
  });
};

export const getBlogs = async (req: Request, res: Response) => {
  BlogModel.find({ isPublished: true })
    .select("-content")
    .then((blogs: any) => {
      return res.status(200).json({
        success: true,
        blogs,
      });
    })
    .catch((error: any) => {
      return res.status(400).json({
        success: false,
        msg: "Unknown Error Ocurred getting the requested Blogs",
      });
    });
};

export const updateBlogViewCount = (req: Request, res: Response) => {
  const blogId = req.params.blogId;

  //TODO: Store IP Address and update view count accordingly
  // console.log(req.clientIp);

  if (!isValidObjectId(blogId))
    return res.status(400).json({
      success: false,
      msg: "Invalid Blog Id",
    });

  BlogModel.findOne({ _id: blogId, isPublished: true }).then((blog: any) => {
    if (!blog) {
      return res.status(400).json({
        success: false,
        msg: "Blog does not exist",
      });
    }

    blog.viewCount = blog.viewCount + 1;
    blog
      .save()
      .then((_: any) => {
        return res.status(200).json({
          success: true,
          viewCount: blog.viewCount,
        });
      })
      .catch((_: any) => {
        return res.status(400).json({
          success: false,
          msg: "Unknown Error Ocurred updating view count of the blog",
        });
      });
  });
};

export const getBlogViewCount = (req: Request, res: Response) => {
  const blogId = req.params.blogId;

  if (!isValidObjectId(blogId))
    return res.status(400).json({
      success: false,
      msg: "Invalid Blog Id",
    });

  BlogModel.findOne({ _id: blogId, isPublished: true }).then((blog: any) => {
    if (!blog) {
      return res.status(400).json({
        success: false,
        msg: "Blog does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      viewCount: blog.viewCount,
    });
  });
};
