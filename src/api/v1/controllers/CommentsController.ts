import { Response } from "express";
import { validateComment } from "../validation/CommentValidation";
import Comment from "../models/Comment";
import BlogModel from "../models/Blog";
import { isValidObjectId } from "mongoose";

export const getComment = (req: any, res: Response) => {
  const commentId = req.params.commentId;

  if (!commentId)
    return res.status(400).json({
      success: false,
      msg: "Invalid Comment Id",
    });

  Comment.findOne({ _id: commentId })
    .then((comment: any) => {
      if (comment)
        return res.status(200).json({
          success: true,
          comment,
        });
      else
        return res.status(400).json({
          success: false,
          msg: "The specified comment not found",
        });
    })
    .catch((error: any) => {
      return res.status(400).json({
        success: false,
        msg: "Unknown Error Ocurred getting the requested comment",
      });
    });
};

export const getComments = (req: any, res: Response) => {
  const blogId = req.params.blogId;

  if (!blogId)
    return res.status(400).json({
      success: false,
      msg: "Invalid Blog Id",
    });

  Comment.find({ blogId: blogId })
    .sort({ date: "desc" })
    .then((comments: any) => {
      return res.status(200).json({
        success: true,
        blogId,
        comments,
      });
    })
    .catch((error: any) => {
      return res.status(400).json({
        success: false,
        msg: "Unknown Error Ocurred getting the comments for the requested blog",
      });
    });
};

export const addComment = (req: any, res: Response) => {
  const authorId = req.userId;

  if (!authorId)
    return res.status(400).json({
      success: false,
      msg: "Unknown Error Ocurred Getting User",
    });

  const blogId = req.params.blogId;

  if (!isValidObjectId(blogId))
    return res.status(400).json({
      success: false,
      msg: "Invalid Blog Id",
    });

  BlogModel.findById(blogId)
    .then((blog: any) => {
      if (!blog) {
        return res.status(400).json({
          success: false,
          msg: "Blog does not exist",
        });
      }

      const { text } = req.body;
      const comment = {
        blogId,
        authorId,
        text,
        date: Date.now(),
      };

      const isValid = validateComment(comment);

      if (isValid.error) {
        return res.status(400).json({ success: false, msg: "Invalid Inputs" });
      }

      const newComment = new Comment(comment);
      newComment
        .save()
        .then((comment: any) => {
          return res.status(200).json({
            success: true,
            msg: "Comment Added Successfully",
            comment,
          });
        })
        .catch((error: any) => {
          return res.status(400).json({
            success: false,
            msg: "Error occurred when adding the comment",
          });
        });
    })
    .catch((error: any) => {
      return res.status(400).json({
        success: false,
        msg: "Error occurred getting the required blog",
      });
    });
};
