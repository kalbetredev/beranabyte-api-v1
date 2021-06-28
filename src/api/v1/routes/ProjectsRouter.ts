import express from "express";
import { addProject, getProjects } from "../controllers/ProjectsController";
import auth from "../middlewares/auth";

const router = express.Router();

router.route("/").get(getProjects);
router.route("/").post(auth, addProject);

export default router;
