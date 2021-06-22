import express from "express";
import {
  getUserPublicData,
  getUserAccount,
} from "../controllers/UserController";

const router = express.Router();

router.route("/account").get(getUserAccount);
router.route("/:id").get(getUserPublicData);

export default router;
