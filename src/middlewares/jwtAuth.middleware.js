import jwt from "jsonwebtoken";
import { ApplicationError } from "./errorHandler.middleware.js";
import UserModel from "../features/user/user.model.js";

const jwtAuth = async (req, res, next) => {
  // retrieve token from request
  // const token = req.headers["authorization"];
  const token = req.cookies.jwtToken;
  const clientId = req.cookies.clientId;

  // If token is not present, send error
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "jwt details not found, please login first",
    });
  }

  // verify the token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(payload.userId);

    // Checking if the jwtToken is same as in the user document for given clientId
    const validToken = user.tokens.find(
      (ele) => ele.clientId == clientId && ele.jwtToken == token
    );

    if (!validToken) {
      throw "Unauthorized";
    }

    req.userId = payload.userId;
    next();
  } catch (err) {
    // console.log(err);
    res
      .status(401)
      .json({ success: false, message: "Unauthorized! Login again" });
  }
};

export default jwtAuth;
