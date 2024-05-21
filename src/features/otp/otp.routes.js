import express from "express";
import OtpController from "./otp.controller.js";

const otpRouter = express.Router();
const otpController = new OtpController();

otpRouter.post("/send", (req, res, next) =>
  otpController.sendOTP(req, res, next)
);

otpRouter.post("/verify", (req, res, next) =>
  otpController.verifyOTP(req, res, next)
);

export default otpRouter;
