import { Response } from "express";
import Reply from "../models/Reply";
import Comment from "../models/Comment";
import { validateReply } from "../validation/ReplyValidation";

export const getReply = (req: any, res: Response) => {
  const replyId = req.params.replyId;

  if (!replyId)
    return res.status(400).json({
      success: false,
      msg: "Invalid Reply Id",
    });

  Reply.findById(replyId)
    .then((reply: any) => {
      if (!reply)
        return res.status(400).json({
          success: false,
          msg: "No reply found with this id",
        });

      return res.status(200).json({
        success: true,
        reply,
      });
    })
    .catch((error: any) => {
      return res.status(400).json({
        success: false,
        msg: "Unknown Error Ocurred getting the reply with the given id",
      });
    });
};

export const getReplies = (req: any, res: Response) => {
  const commentId = req.params.commentId;

  if (!commentId)
    return res.status(400).json({
      success: false,
      msg: "Invalid Comment Id",
    });

  Reply.find({ commentId: commentId })
    .then((replies: any) => {
      return res.status(200).json({
        success: true,
        commentId,
        replies,
      });
    })
    .catch((error: any) => {
      return res.status(400).json({
        success: false,
        msg: "Unknown Error Ocurred getting the replies for the requested comment",
      });
    });
};

export const addReply = (req: any, res: Response) => {
  const authorId = req.userId;

  if (!authorId)
    return res.status(400).json({
      success: false,
      msg: "Unknown Error Ocurred Getting User",
    });

  const commentId = req.params.commentId;

  if (!commentId)
    return res.status(400).json({
      success: false,
      msg: "Invalid Comment Id",
    });

  Comment.findById(commentId)
    .then((comment: any) => {
      if (!comment) {
        return res.status(400).json({
          success: false,
          msg: "Comment does not exist",
        });
      }

      const { text } = req.body;
      const reply = {
        commentId,
        authorId,
        text,
        date: Date.now(),
      };

      const isValid = validateReply(reply);
      if (isValid.error) {
        return res.status(400).json({ success: false, msg: "Invalid Inputs" });
      }

      const newReply = new Reply(reply);
      newReply
        .save()
        .then((reply: any) => {
          return res.status(400).json({
            success: true,
            msg: "Reply Added Successfully",
            reply,
          });
        })
        .catch((error: any) => {
          return res.status(400).json({
            success: false,
            msg: "Error occurred when adding the reply",
          });
        });
    })
    .catch((error: any) => {
      return res.status(400).json({
        success: false,
        msg: "Error occurred getting the required comment",
      });
    });
};
