import express from "express";
import UserController from "./user.controller.js";
import OtpController from "../otp/otp.controller.js";
import { otpVerify } from "../../middlewares/otpVerify.middleware.js";
import { validateUserData } from "../../middlewares/validation.middleware.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";
import { fileUpload } from "../../middlewares/fileUpload.middleware.js";

const userRouter = express.Router();

const userController = new UserController();
const otpController = new OtpController();

userRouter.post("/signup", validateUserData, (req, res, next) =>
  userController.signUp(req, res, next)
);
userRouter.post("/signin", (req, res, next) =>
  userController.signIn(req, res, next)
);
userRouter.get("/logout", jwtAuth, (req, res, next) =>
  userController.logout(req, res, next)
);
userRouter.get("/logout-all-devices", jwtAuth, (req, res, next) =>
  userController.logoutAllDevices(req, res, next)
);
userRouter.get("/get-details/:id", (req, res, next) =>
  userController.getDetails(req, res, next)
);
userRouter.get("/get-all-details", (req, res, next) =>
  userController.getAllDetails(req, res, next)
);

userRouter.put("/update-details/:id", (req, res, next) =>
  userController.updateDetails(req, res, next)
);

userRouter.post("/reset-password", otpVerify, (req, res, next) =>
  userController.resetPassword(req, res, next)
);

userRouter.post(
  "/upload-avatar",
  fileUpload.single("avatar"),
  jwtAuth,
  (req, res, next) => userController.uploadAvatar(req, res, next)
);

export default userRouter;
