import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserService } from "./User.service";

const getUserDetails = catchAsync(async (req, res) => {
  const { phone } = req.params;
  const result = await UserService.getUserDetails(phone);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details fetched successfully.",
    data: result,
  });
});

const toggleUserStatus = catchAsync(async (req, res) => {
  const { phone } = req.params;
  const { status } = req.body; // true = block, false = unblock
  const result = await UserService.toggleUserStatus(phone, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const searchUserByPhone = catchAsync(async (req, res) => {
  const { phone } = req.params;
  const result = await UserService.searchUserByPhone(phone);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User found.",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User found.",
    data: result,
  });
});

export const UserController = {
  getUserDetails,
  toggleUserStatus,
  searchUserByPhone,
  getAllUsers,
};
