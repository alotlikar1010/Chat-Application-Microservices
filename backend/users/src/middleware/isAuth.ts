import type { NextFunction, Request, Response } from "express";
import type { IUser } from "../model/index.js";
import { User } from "../model/index.js";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
};
export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer")) {
            res.status(401).json({
                message: "please Login No suth header"
            });
            return;
        }
        const tokenValue = token.split(" ")[1];
        if (!tokenValue) {
            res.status(401).json({
                message: "Invalid token format"
            });
            return;
        }
        const decodeToken = jwt.verify(tokenValue, process.env.JWT_SECRET as string);

        const userData = await User.findById((decodeToken as { id: string }).id);
        if (!userData) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        req.user = userData;
        next();
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
