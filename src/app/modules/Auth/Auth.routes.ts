import express from "express";
import validateRequest from "../../middlewares/validRequest";
import { AuthControllers } from "./Auth.controller";
import { AuthValidation } from "./Auth.validation";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(AuthValidation.registrationSchema),
  AuthControllers.SignUp
);

router.post("/login", AuthControllers.login);
router.post("/logout", AuthControllers.logout);

export const authRoutes = router;
