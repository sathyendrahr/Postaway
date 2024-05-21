import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserRepository from "./user.repository.js";
import { ApplicationError } from "../../middlewares/errorHandler.middleware.js";
import getHashedPassword from "../../utils/getHashedPassword.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    const { name, email, password, gender } = req.body;
    try {
      const hashedPassword = await getHashedPassword(password);
      const user = await this.userRepository.signUp({
        name,
        email,
        password: hashedPassword,
        gender,
      });

      if (!user) {
        throw new ApplicationError(500, "User can't be created at the moment");
      }

      res.status(201).json({
        success: true,
        message: "User created",
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res, next) {
    const { email, password } = req.body;

    try {
      let user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        throw new ApplicationError(404, "User not found");
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // If credentials are valid,
      let clientId;
      if (req.cookies && req.cookies.clientId) {
        clientId = req.cookies.clientId;
      }

      const clientInfo = await this.userRepository.getClientInfo(
        user,
        clientId
      );
      user = clientInfo.user;
      clientId = clientInfo.clientId;

      // Create jwt token
      const token = jwt.sign(
        // Payload
        { userId: user._id },
        // Secret key
        process.env.JWT_SECRET_KEY || "secretpostaway",
        // expiry
        { expiresIn: process.env.JWT_EXPIRY || "1h" }
      );

      // Update token in user document for the clientId
      user = await this.userRepository.updateToken(user, clientId, token);

      // Set response cookies
      res.cookie("jwtToken", token);
      res.cookie("clientId", clientId);

      // Send token to client
      res
        .status(200)
        .json({ success: true, message: "Signin successful", clientId, token });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie("jwtToken");
      await this.userRepository.logout(req.userId, req.cookies.clientId);
      res
        .status(200)
        .send({ success: true, message: "User logged out successfully" });
    } catch (err) {
      next(err);
    }
  }

  async logoutAllDevices(req, res, next) {
    try {
      res.clearCookie("jwtToken");
      await this.userRepository.logoutAllDevices(req.userId);
      res.status(200).send({
        success: true,
        message: "Logged out of all devices successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async getDetails(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await this.userRepository.getUserDetails(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }

  async getAllDetails(req, res, next) {
    try {
      const users = await this.userRepository.getAllUsers();
      if (!users || users.length < 0) {
        return res.status(200).json({
          success: true,
          message: "No users found",
        });
      }

      res.status(200).json({
        success: true,
        users,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateDetails(req, res, next) {
    try {
      const userId = req.params.id;
      const updatedUser = await this.userRepository.updateDetails(
        userId,
        req.body
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      res.status(200).json({
        success: true,
        updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      const avatar = "images/" + req.file.filename;
      const userId = req.userId;

      const user = await this.userRepository.uploadAvatar(userId, avatar);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      res.status(200).json({
        success: true,
        avatar: { _id: user._id, avatar: user.avatar },
      });
    } catch (err) {
      next(err);
    }
  }

  // Reset password method will be called only after the otp verify
  // through middleware
  async resetPassword(req, res, next) {
    try {
      const { email, newPassword } = req.body;

      if (!newPassword || newPassword == "")
        return res.status(400).json({
          success: false,
          error: "newPassword not provided",
        });

      const hashedPassword = await getHashedPassword(newPassword);
      await this.userRepository.resetPassword(email, hashedPassword);

      res.status(200).json({
        success: true,
        message: "Password reset is successful",
      });
    } catch (err) {
      next(err);
    }
  }
}
