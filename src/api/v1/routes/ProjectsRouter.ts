import express from "express";
import {
  addProject,
  getProjects,
  relateBlogToProject,
} from "../controllers/ProjectsController";
import auth from "../middlewares/auth";

const router = express.Router();

router.route("/:projectId/relate").post(auth, relateBlogToProject);
router.route("/").get(getProjects);
router.route("/").post(auth, addProject);

export default router;
