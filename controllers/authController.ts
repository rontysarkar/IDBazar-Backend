import { Request, Response } from "express";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
import {
  sendResetPasswordLinkToEmail,
  sendVerificationToEmail,
} from "../config/emailConfig";
import { generatAccessToken } from "../utils/generateAccessToken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return response(res, 400, "User Already exists");
    }

    const verificationToken = await crypto.randomBytes(20).toString("hex");
    const user = new User({ name, email, password, verificationToken });
    await user.save();

    const result = await sendVerificationToEmail(email, verificationToken);

    console.log(result);
    response(
      res,
      200,
      "User register successfully, Please check your email to varify your account",
    );
  } catch (error) {
    console.log(error);
    response(res, 500, "Intarnal Server Error,Please try again");
  }
};

export const emailVerify = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return response(res, 400, "Invalild or Expried Verification Token");
    }

    user.isVarified = true;
    user.verificationToken = undefined;

    const accessToken = generatAccessToken(user);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    await user.save();
    return response(res, 200, "Verify Successfully");
  } catch (error) {
    console.log(error);
    response(res, 500, "Intarnal Server Error,Please try again");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return response(res, 400, "Invaid Email or Password");
    }

    if (!user.isVarified) {
      return response(
        res,
        400,
        "Please verify your email before login, check your email inbox to verify",
      );
    }
    const accessToken = generatAccessToken(user);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return response(res, 200, "User Logged in successfully", {
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    response(res, 500, "Intarnal Server Error,Please try again");
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 500, "No Account found with this email address");
    }

    const resetPasswordToken = await crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();
    await sendResetPasswordLinkToEmail(email, resetPasswordToken);
    return response(res, 200, "Send Reset Password Link to Your Email");
  } catch (error) {
    console.log(error);
    response(res, 500, "Intarnal Server Error,Please try again");
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return response(res, 400, "Invalid or Exprired rest password token");
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return response(
      res,
      200,
      "Your Password reset successfully,Now you can login in",
    );
  } catch (error) {
    console.log(error);
    response(res, 500, "Intarnal Server Error,Please try again");
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
    });
    return response(res, 200, "Successfully Logout");
  } catch (error) {
    console.log(error);
    response(res, 500, "Intarnal Server Error,Please try again");
  }
};

export const checkUserAuth = async (req: Request, res: Response) => {
  try {
    const userId = req?.id;
    if (!userId) {
      return response(res, 401, "Not Authorize user");
    }

    const user = await User.findById(userId).select(
      "-password -verificationToken -resetPasswordExpires -resetPasswordToken",
    );
    if (!user) {
      return response(res, 403, "User not found");
    }
    return response(res, 200, "User retrived successfully", user);
  } catch (error) {
    console.log(error);
    response(res, 500, "Intarnal Server Error,Please try again");
  }
};
