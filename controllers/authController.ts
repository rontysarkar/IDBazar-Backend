import { Request, Response } from "express";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import crypto from 'crypto'
import { sendVerificationToEmail } from "../config/emailConfig";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return response(res,400,"User Already exists")
    }

    const verificationToken = await crypto.randomBytes(20).toString('hex');
    const user = new User({name,email,password,verificationToken});
    await user.save();
    const result = await sendVerificationToEmail(email,verificationToken);
    console.log(result)
    response(res,200,"User register successfully, Please check your email to varify your account")

  } catch (error) {
    console.log(error);
    response(res,500,"Intarnal Server Error,Please try again");
  }
};
