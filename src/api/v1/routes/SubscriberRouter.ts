import express from "express";
import { addSubscriber } from "../controllers/SubscriberController";

const router = express.Router({ mergeParams: true });

router.route("/subscribe").post(addSubscriber);

export default router;
