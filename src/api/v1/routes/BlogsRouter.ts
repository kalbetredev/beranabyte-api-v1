import express from "express";
import {
  getCategories,
  getBlog,
  getBlogs,
  addBlog,
} from "../controllers/BlogsController";
import auth from "../middlewares/auth";

const router = express.Router({ mergeParams: true });

router.route("/categories").get(getCategories);
router.route("/:blogId").get(getBlog);
router.route("/").get(getBlogs);
router.route("/").post(auth, addBlog);

export default router;
