import OtpRepository from "../features/otp/otp.repository.js";

const otpRepository = new OtpRepository();

export const otpVerify = async (req, res, next) => {
  const { email, otp } = req.body;
  const response = await otpRepository.verifyOTP(email, otp);
  if (!response)
    return res.status(400).json({
      success: false,
      message: "OTP is not valid",
    });

  next();
};
