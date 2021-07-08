import { config } from "dotenv";
config();

import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const JWT_KEYS = JSON.parse(process.env.JWT_KEYS || "");
export const PRIV_KEY = JWT_KEYS.JWT_PRIVATE_KEY;

export const isPasswordValid = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const genPasswordHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const issueJWT = (user: any) => {
  const _id = user._id;
  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: signedToken,
    expiresIn: expiresIn,
  };
};
