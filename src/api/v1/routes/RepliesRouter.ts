import express from "express";
import {
  getReply,
  getReplies,
  addReply,
} from "../controllers/RepliesController";
import auth from "../middlewares/auth";

const router = express.Router({ mergeParams: true });

router.route("/:replyId").get(getReply);
router.route("/").get(getReplies);
router.route("/").post(auth, addReply);

export default router;
