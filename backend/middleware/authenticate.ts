import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import asyncHandler from "./asyncHandler";
import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: string
  }

  declare global {
    namespace Express {
        interface Request {
            user?: Record<string,any>
        }
    }
}

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    //Read JWT from the 'jwt' cookie
    token = req.cookies.jwt

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
            req.user = await User.findById(decoded.userId).select("-password")
            next();
        } catch (error) {
            res.status(401)
            throw new Error("Not authorized, token failed")
        }
    } else {
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})