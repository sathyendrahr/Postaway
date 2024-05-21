import otpGenerator from "otp-generator";
import OtpModel from "./otp.model.js";
import UserModel from "../user/user.model.js";

export default class OtpRepository {
  async sendOTP(email) {
    // Check if user is already present
    const checkUserPresent = await UserModel.findOne({ email });
    if (!checkUserPresent) {
      return 404;
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OtpModel.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OtpModel.findOne({ otp: otp });
    }
    const otpBody = new OtpModel({ email, otp });
    return await otpBody.save();
  }

  async verifyOTP(email, otp) {
    // Find the most recent OTP for the email
    const response = await OtpModel.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return false;
    }
    await OtpModel.deleteMany({ email });
    return true;
  }
}
