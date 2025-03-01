import express from "express";
import { UserController } from "./User.controller";
import { USER_ROLE } from "./User.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth(USER_ROLE.ADMIN), UserController.getAllUsers);

router.patch(
  "/status/:phone",
  auth(USER_ROLE.ADMIN),
  UserController.toggleUserStatus
);
router.get(
  "/search/:phone",
  auth(USER_ROLE.ADMIN),
  UserController.searchUserByPhone
);

router.get(
  "/me",
  auth(USER_ROLE.ADMIN, USER_ROLE.AGENT, USER_ROLE.USER),
  UserController.getMe
);

export const UserRoutes = router;
