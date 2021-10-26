import express from "express";
import {
  getBlog,
  updateBlogViewCount,
  getBlogViewCount,
  getBlogs,
  getTopics,
} from "../controllers/BlogsController";

const router = express.Router({ mergeParams: true });

router.route("/topics").get(getTopics);
router
  .route("/:blogId/view-count")
  .get(getBlogViewCount)
  .patch(updateBlogViewCount);
router.route("/:blogId").get(getBlog);
router.route("/").get(getBlogs);

export default router;
