import { generate } from "random-key";
import UserModel from "./user.model.js";

export default class UserRepository {
  async signUp(userData) {
    const user = new UserModel(userData);
    await user.save();
    return await UserModel.findById(user._id).select({
      password: false,
      tokens: false,
    });
  }

  async getUserByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async getUserById(userId) {
    return await UserModel.findById(userId);
  }

  async getUserDetails(userId) {
    return await UserModel.findById(userId).select({ password: 0, tokens: 0 });
  }

  async getAllUsers() {
    return await UserModel.find({}, { password: 0, tokens: 0 });
  }

  async getClientInfo(user, clientId) {
    /* This method creates clientId, if a new device login,
    else returns existing clientId */

    if (!clientId) {
      clientId = generate();
      user.tokens.push({ clientId });
      await user.save();
    }
    return { user, clientId };
  }

  async updateToken(user, clientId, jwtToken) {
    /* This method creates or updates the token record for a user and specific clientId */

    const token = await user.tokens.find((token) => token.clientId == clientId);
    if (!token) {
      user.tokens.push({ clientId, jwtToken });
    } else {
      token.jwtToken = jwtToken;
    }

    return await user.save();
  }

  async uploadAvatar(userId, avatar) {
    const user = await this.getUserById(userId);
    user.avatar = avatar;
    return await user.save();
  }

  async logout(userId, clientId) {
    /* Logout is implemented by clearing the cookie as well as removing the
    existing token record for that user with specific clientId
    So next time user logs in again, will be treated as new device login */

    const user = await this.getUserById(userId);
    user.tokens = user.tokens.filter((token) => token.clientId != clientId);
    await user.save();
  }

  async logoutAllDevices(userId) {
    /* Logout from all devices is implemented by removing all the clientId(device) 
    and their tokens from the user tokens record */
    const user = await this.getUserById(userId);
    user.tokens = [];
    await user.save();
  }

  async updateDetails(userId, userData) {
    const user = await this.getUserById(userId);
    if (!user) return;

    const { name, gender } = userData;
    if (name) {
      user.name = name;
    }

    if (gender) {
      user.gender = gender;
    }

    await user.save();

    return await UserModel.findById(user._id).select({
      password: false,
      tokens: false,
    });
  }

  async resetPassword(email, newPassword) {
    const user = await this.getUserByEmail(email);

    user.password = newPassword;
    await user.save();
  }
}
