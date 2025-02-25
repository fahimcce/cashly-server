import httpStatus from "http-status";
import * as bcrypt from "bcrypt";

import { User } from "./Auth.model";
import ApiError from "../../errors/ApiError";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";
import { Tlogin, TUser } from "./Auth.interface";
import config from "../../config";
import Session from "./Session.model";

const SignUp = async (payload: TUser) => {
  const isUserExist = await User.findOne({
    $or: [
      { email: payload.email },
      { phone: payload.phone },
      { nid: payload.nid },
    ],
  });

  if (isUserExist) {
    throw new ApiError(
      httpStatus.ALREADY_REPORTED,
      "User already exists. Please login"
    );
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);
  if (payload.role == "agent") {
    payload.balance = 100000;
  }

  const userData = {
    ...payload,
    password: hashedPassword,
  };

  const result = await User.create(userData);
  return result;
};

const login = async (payload: Tlogin) => {
  const identifier = payload.identifier;
  if (!identifier || !payload.password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Identifier and password are required."
    );
  }

  const userData = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  });

  if (!userData) {
    throw new ApiError(httpStatus.ALREADY_REPORTED, "Please register first.");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isPasswordValid) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Password incorrect! Try again."
    );
  }

  const accessToken = jwtHelpers.tokenGenerator(
    { identifier, role: userData.role },
    config.jwt_access_token as Secret,
    config.jwt_access_expires_in as string
  );

  const refreshToken = jwtHelpers.tokenGenerator(
    { identifier, role: userData.role },
    config.jwt_refresh_token as Secret,
    config.jwt_refresh_expires_in as string
  );

  await Session.findOneAndUpdate(
    { userId: userData._id },
    { token: accessToken, createdAt: new Date() },
    { upsert: true, new: true }
  );

  return { accessToken, refreshToken };
};
const logout = async (userId: string) => {
  const session = await Session.findOneAndDelete({ userId });

  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not logged in.");
  }

  return { message: "Logged out successfully." };
};

export const AuthServices = {
  SignUp,
  login,
  logout,
};
