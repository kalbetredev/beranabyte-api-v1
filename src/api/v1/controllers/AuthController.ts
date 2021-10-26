import { Request, Response } from "express";
import {
  genPasswordHash,
  isPasswordValid,
  issueJWT,
} from "../helpers/passwordUtils";
import User from "../models/User";
import { NORMAL_ROLE } from "../models/UserRoles";
import {
  validateRegistration,
  validateLoginInputs,
} from "../validation/UserValidation";

const createUser = async (email: string, password: string) => {
  const passwordHash = await genPasswordHash(password);

  const newUser = new User({
    email: email,
    hash: passwordHash,
    role: NORMAL_ROLE,
  });

  return newUser;
};

export const register = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, msg: "Invalid Request" });
  }

  const isValid = validateRegistration({ email, password });
  if (isValid.error) {
    return res.status(400).json({ success: false, msg: "Invalid Inputs" });
  } else {
    User.findOne({ email: email })
      .then(async (user: any) => {
        if (user) {
          return res
            .status(400)
            .json({ success: false, msg: "User Already Exists" });
        }

        const newUser = await createUser(email, password);

        newUser.save().then((user: any) => {
          const userJwt = issueJWT(user);
          return res.status(200).json({
            success: true,
            msg: "User Registered Successfully",
            user: {
              id: user._id,
              email: user.email,
            },
            token: userJwt.token,
            expiresIn: userJwt.expiresIn,
          });
        });
      })
      .catch((err: any) => {
        return res.status(400).json({
          success: false,
          msg: "Unknown Error Ocurred Registering User",
        });
      });
  }
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, msg: "Invalid Request" });
  }

  const isValid = validateLoginInputs({ email, password });
  if (isValid.error) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalid Email or Password" });
  } else {
    User.findOne({ email: email })
      .then(async (user: any) => {
        if (!user)
          return res.status(401).json({
            success: false,
            msg: "Invalid Email or Password",
          });

        const isValid = await isPasswordValid(password, user.hash);

        if (isValid) {
          const userJwt = issueJWT(user);
          return res.status(200).json({
            success: true,
            msg: "User LoggedIn Successfully",
            user: {
              id: user._id,
              email: user.email,
            },
            token: userJwt.token,
            expiresIn: userJwt.expiresIn,
          });
        } else {
          return res.status(401).json({
            success: false,
            msg: "Invalid Email or Password",
          });
        }
      })
      .catch((err: any) => {
        return res.status(400).json({
          success: false,
          msg: "Unknown Error Ocurred Signing In User",
        });
      });
  }
};
