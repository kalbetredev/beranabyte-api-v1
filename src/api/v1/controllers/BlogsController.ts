import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Blog from "../models/Blog";
import User from "../models/User";
import { ADMIN_ROLE, WRITER_ROLE } from "../models/UserRoles";
import { validateBlog } from "../validation/BlogValidation";

export const getCategories = (req: Request, res: Response) => {
  Blog.find({}).then((blogs: any) => {
    if (!blogs) {
      return res.status(400).json({
        success: false,
        msg: "No Blogs Found",
      });
    }

    const categories = new Set();
    blogs.map((blog: any) => categories.add(blog.category));

    return res.status(200).json({
      success: true,
      categories: Array.from(categories),
    });
  });
};

export const getBlog = (req: Request, res: Response) => {
  const blogId = req.params.blogId;
  const onlySummary = req.query.onlySummary;

  if (!isValidObjectId(blogId))
    return res.status(400).json({
      success: false,
      msg: "Invalid Blog Id",
    });

  Blog.findById(blogId).then((blog: any) => {
    if (!blog) {
      return res.status(400).json({
        success: false,
        msg: "Blog does not exist",
      });
    }

    blog.viewCount = blog.viewCount + 1;
    blog
      .save()
      .then((updatedBlog: any) => {
        if (onlySummary) updatedBlog.mdx = "";
        return res.status(200).json({
          success: true,
          blog: updatedBlog,
        });
      })
      .catch((error: any) => {
        console.log(error);
        return res.status(400).json({
          success: false,
          msg: "Unknown Error Ocurred getting the requested Blog",
        });
      });
  });
};

export const getBlogs = (req: Request, res: Response) => {
  const category = req.query.category;

  let filter = {};
  if (category) {
    filter = { category: { $regex: `^${category}$`, $options: "i" } };
  }

  Blog.find(filter)
    .select("-mdx")
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

export const getMostViewedBlogs = (req: Request, res: Response) => {
  const countParam = req.query.count;
  const count = countParam ? parseInt(countParam.toString()) ?? 5 : 5;

  Blog.find({})
    .sort({ viewCount: "desc" })
    .limit(count)
    .select("-mdx")
    .exec((error: any, blogs: any) => {
      if (error)
        return res.status(400).json({
          success: false,
          msg: "Unknown Error Ocurred getting the popular blogs",
        });

      return res.status(200).json({
        success: true,
        blogs,
      });
    });
};

export const getLatestBlogs = (req: Request, res: Response) => {
  const countParam = req.query.count;
  const count = countParam ? parseInt(countParam.toString()) ?? 5 : 5;

  Blog.find({})
    .sort({ publishedAt: "desc" })
    .limit(count)
    .select("-mdx")
    .exec((error: any, blogs: any) => {
      if (error)
        return res.status(400).json({
          success: false,
          msg: "Unknown Error Ocurred getting the latest blogs",
        });

      return res.status(200).json({
        success: true,
        blogs,
      });
    });
};

export const getFeaturedBlogs = (req: Request, res: Response) => {
  const countParam = req.query.count;
  const count = countParam ? parseInt(countParam.toString()) ?? 5 : 5;

  Blog.find({ isFeatured: true })
    .sort({ publishedAt: "desc" })
    .limit(count)
    .select("-mdx")
    .exec((error: any, blogs: any) => {
      if (error)
        return res.status(400).json({
          success: false,
          msg: "Unknown Error Ocurred getting the latest blogs",
        });

      return res.status(200).json({
        success: true,
        blogs,
      });
    });
};

export const addBlog = (req: any, res: Response) => {
  const userId = req.userId;

  if (!userId)
    return res.status(400).json({
      success: false,
      msg: "Unknown Error Ocurred Getting User",
    });

  User.findOne({ _id: userId }).then((user: any) => {
    if (user.role === WRITER_ROLE || user.role === ADMIN_ROLE) {
      saveBlog(req, res);
    } else {
      return res.status(400).json({
        success: false,
        msg: "This user can not publish blogs",
      });
    }
  });
};

const saveBlog = (req: any, res: Response) => {
  const { title, category, summary, imageUrl } = req.body;
  const publishedAt = Date.now();
  const viewCount = 1;

  const blog = {
    title,
    category,
    publishedAt,
    summary,
    imageUrl,
    viewCount,
  };
  const isValid = validateBlog(blog);

  if (isValid.error) {
    return res.status(400).json({ success: false, msg: "Invalid Inputs" });
  }

  const newBlog = new Blog(blog);
  newBlog
    .save()
    .then((blog: any) => {
      return res.status(400).json({
        success: false,
        msg: "Blog Added Successfully",
        blog,
      });
    })
    .catch((error: any) => {
      return res.status(400).json({
        success: false,
        msg: "Error occurred when adding the blog",
      });
    });
};
