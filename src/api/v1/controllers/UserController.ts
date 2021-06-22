import { Response } from "express";
import User from "../models/User";

export const getUserAccount = (req: any, res: Response) => {
  const id = req.userId;

  if (!id)
    return res.status(400).json({
      success: false,
      msg: "Unknown Error Ocurred Getting User",
    });

  User.findOne({ _id: id }).then((user: any) => {
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "User Account Details Fetched Successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  });
};

export const getUserPublicData = (req: any, res: Response) => {
  const id = req.params.id;

  if (!id)
    return res.status(400).json({
      success: false,
      msg: "Unknown Error Ocurred Getting User",
    });

  User.findOne({ _id: id }).then((user: any) => {
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "User Fetched Successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  });
};
