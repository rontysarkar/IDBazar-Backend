import jwt from "jsonwebtoken";
import { IUSER } from "../models/User";

export const generatAccessToken = (user: IUSER) => {
  return jwt.sign({ userId: user?._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};
