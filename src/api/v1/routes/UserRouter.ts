import express from "express";
import {
  getUserPublicData,
  getUserAccount,
} from "../controllers/UserController";
import auth from "../middlewares/auth";

const router = express.Router();

router.route("/account").get(auth, getUserAccount);
router.route("/:id").get(getUserPublicData);

export default router;
