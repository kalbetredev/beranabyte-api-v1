import express from "express";
import {
  getCategories,
  getBlog,
  getBlogs,
  addBlog,
  getMostViewedBlogs,
  getLatestBlogs,
  getFeaturedBlogs,
} from "../controllers/BlogsController";
import auth from "../middlewares/auth";

const router = express.Router({ mergeParams: true });

router.route("/categories").get(getCategories);
router.route("/popular").get(getMostViewedBlogs);
router.route("/latest").get(getLatestBlogs);
router.route("/featured").get(getFeaturedBlogs);
router.route("/:blogId").get(getBlog);
router.route("/").get(getBlogs);
router.route("/").post(auth, addBlog);

export default router;
