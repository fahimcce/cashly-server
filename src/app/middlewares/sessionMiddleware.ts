import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import Session from "../modules/Auth/Session.model";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("No token found!"); // 🔍 Debugging line
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded: any = jwt.verify(token, config.jwt_access_token as string);

    console.log("Decoded token:", decoded); // 🔍 Debugging line

    const session = await Session.findOne({ userId: decoded.userId });

    if (!session || session.token !== token) {
      console.log("Session expired or token mismatch!"); // 🔍 Debugging line
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }

    req.user = { userId: decoded.userId }; // ✅ Correctly set `userId` on `req.user`
    console.log("req.user set in middleware:", req.user); // 🔍 Debugging line

    next(); // ✅ Call next() to continue to logout controller
  } catch (error) {
    console.error("JWT Verification Error:", error); // 🔍 Debugging line
    res.status(401).json({ message: "Invalid token." });
  }
};
