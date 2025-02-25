import { NextFunction, Request, Response } from "express";

import config from "../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import { jwtHelpers } from "../helpers/jwtHelpers";

const auth = (...rules: string[]) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(401, "You are not authorized");
      }

      const varifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt_access_token as Secret
      );

      req.user = varifiedUser;
      if (rules.length && !rules.includes(varifiedUser.role)) {
        throw new ApiError(403, "Forbidden");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
