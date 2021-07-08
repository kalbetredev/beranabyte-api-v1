import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { PRIV_KEY } from "../helpers/passwordUtils";

const auth = (req: any, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");

  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Access Denied. You are unauthorized to access this api end point",
      });
    }

    const decodedToken = verify(token!!.toString(), PRIV_KEY, {
      algorithms: ["RS256"],
    });
    req.userId = decodedToken.sub;
    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      msg: "Request made with invalid token.",
    });
  }
};

export default auth;
