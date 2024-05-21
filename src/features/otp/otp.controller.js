import OtpRepository from "./otp.repository.js";

export default class OtpController {
  constructor() {
    this.otpRepository = new OtpRepository();
  }

  async sendOTP(req, res, next) {
    const { email } = req.body;

    try {
      const otp = await this.otpRepository.sendOTP(email);

      if (otp == 404) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        otp,
      });
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }

  async verifyOTP(req, res, next) {
    const { email, otp } = req.body;
    try {
      const response = await this.otpRepository.verifyOTP(email, otp);
      if (!response)
        return res.status(400).json({
          success: false,
          message: "OTP is not valid",
        });

      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}
