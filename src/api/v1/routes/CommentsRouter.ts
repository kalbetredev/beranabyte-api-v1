import express from "express";
import {
  getComment,
  getComments,
  addComment,
} from "../controllers/CommentsController";
import auth from "../middlewares/auth";

const router = express.Router({ mergeParams: true });

router.route("/:commentId").get(getComment);
router.route("/").get(getComments);
router.route("/").post(auth, addComment);

export default router;
