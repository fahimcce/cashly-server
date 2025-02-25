import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../Auth/Auth.model";
import { Transaction } from "../Transaction/Transaction.model";

const getUserDetails = async (phone: string) => {
  const user = await User.findOne({ phone, isDeleted: false });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  const transactions = await Transaction.find({
    $or: [{ senderPhone: phone }, { receiverPhone: phone }],
  })
    .sort({ createdAt: -1 })
    .limit(100);

  return { user, transactions };
};

// Block or Unblock User
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

// Search User by Phone
const searchUserByPhone = async (phone: string) => {
  const user = await User.findOne({ phone });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  return user;
};

// Admin Show All Users
const getAllUsers = async () => {
  const users = await User.find({ isDeleted: false });
  return users;
};

export const UserService = {
  getUserDetails,
  toggleUserStatus,
  searchUserByPhone,
  getAllUsers,
};
