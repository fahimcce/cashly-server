import express from "express";
import { UserController } from "./User.controller";

const router = express.Router();

router.get("/", UserController.getAllUsers);
router.get("/:phone", UserController.getUserDetails);
router.post("/status/:phone", UserController.toggleUserStatus);
router.get("/search/:phone", UserController.searchUserByPhone);

export const UserRoutes = router;
