import express from "express";
import {
  getCategories,
  getBlog,
  getPublishedBlogs,
  getMostViewedBlogs,
  getLatestBlogs,
  getFeaturedBlogs,
  updateBlogViewCount,
  getAllUserBlogs,
  createNewBlog,
  saveBlog,
  publishBlog,
} from "../controllers/BlogsController";
import auth from "../middlewares/auth";

const router = express.Router({ mergeParams: true });

router.route("/categories").get(getCategories);
router.route("/popular").get(getMostViewedBlogs);
router.route("/latest").get(getLatestBlogs);
router.route("/featured").get(getFeaturedBlogs);
router.route("/all").get(auth, getAllUserBlogs);
router.route("/:blogId/publish").post(auth, publishBlog);
router.route("/:blogId/save").patch(auth, saveBlog);
router.route("/:blogId").get(getBlog).patch(updateBlogViewCount);
router.route("/").get(getPublishedBlogs).post(auth, createNewBlog);

export default router;
