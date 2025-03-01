import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../Auth/Auth.model";
import { Transaction } from "../Transaction/Transaction.model";
import { Request } from "express";

// Block or Unblock User by admin
const toggleUserStatus = async (phone: string, status: boolean) => {
  const user = await User.findOne({ phone });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  user.isDeleted = status;
  await user.save();

  return {
    message: status
      ? "User blocked successfully"
      : "User unblocked successfully",
  };
};

// Admin Search User by Phone
const searchUserByPhone = async (phone: string) => {
  const user = await User.findOne({ phone });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  const transactions = await Transaction.find({
    $or: [{ senderPhone: phone }, { receiverPhone: phone }],
  });
  // .sort({ createdAt: -1 })
  // .limit(100);

  return { user, transactions };
};

// Admin Show All Users
const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const getMe = async (req: Request) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found.");
  }
  const Data = await User.findOne({
    $or: [{ email: user.identifier }, { phone: user.identifier }],
  });
  if (!Data) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Data not found.");
  }
  return { Data };
};

export const UserService = {
  toggleUserStatus,
  searchUserByPhone,
  getAllUsers,
  getMe,
};
