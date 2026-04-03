import { NextFunction, Request, Response } from "express";
import { response } from "../utils/responseHandler";
import jwt from "jsonwebtoken";

declare global{
    namespace Express {
        interface Request{
            id:string;
        }
    }
}


const authenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies?.access_token;
  if (!accessToken) {
    return response(res, 401, "User not authenticated");
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string,
    ) as jwt.JwtPayload;
    if (!decoded) {
        return response(res,401,"UnAuthorize User");
    }

    req.id = decoded?.userId;
    next();
  } catch (error) {
    return response(res,401,"Not Authorize, user not found");
  }
};

export {
    authenticatedUser
}