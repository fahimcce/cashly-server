import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./Auth.service";

const SignUp = catchAsync(async (req, res) => {
  const result = await AuthServices.SignUp(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});
const login = catchAsync(async (req, res) => {
  const result = await AuthServices.login(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "login successfully",
    data: result,
  });
});
const logout = catchAsync(async (req, res) => {
  const result = await AuthServices.logout(req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const AuthControllers = {
  SignUp,
  login,
  logout,
};
