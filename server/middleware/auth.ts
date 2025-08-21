require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

//authenticated user
export const isAuthenticated = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    // If token is not present in cookies
    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    // Decode the token
    let decoded: JwtPayload | null;
    try {
      decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN as string
      ) as JwtPayload;
    } catch (error) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    // If token decoding failed
    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    // Fetch user data from Redis using user id from decoded JWT
    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("Login to access this resource", 400));
    }

    // Parse and set the user object in the request
    req.user = JSON.parse(user);
    console.log("🚀 User from Redis:", req.user); // Debug log

    // Proceed to the next middleware or route handler
    next();
  }
);

//validate user role
export const AuthorizedRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access the resource`,
          403
        )
      );
    }
    next();
  };
};
