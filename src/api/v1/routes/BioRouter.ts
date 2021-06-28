import express from "express";
import { getMyBio } from "../controllers/BioController";

const router = express.Router();

router.route("/").get(getMyBio);

export default router;
