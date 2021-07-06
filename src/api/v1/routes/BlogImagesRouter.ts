import express from "express";
import {
  getBlogImage,
  deleteBlogImage,
  getBlogImages,
  uploadBlogImage,
} from "../controllers/BlogImagesController";
import auth from "../middlewares/auth";
import { uploadMiddleware } from "../services/multerStore";

const router = express.Router({ mergeParams: true });

router.route("/:imageFileName").get(getBlogImage).delete(auth, deleteBlogImage);
router
  .route("/")
  .get(getBlogImages)
  .post(auth, uploadMiddleware, uploadBlogImage);

export default router;
