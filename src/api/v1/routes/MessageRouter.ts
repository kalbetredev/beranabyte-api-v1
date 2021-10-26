import express from "express";
import { addMessage } from "../controllers/MessageController";

const router = express.Router({ mergeParams: true });

router.route("/").post(addMessage);

export default router;
