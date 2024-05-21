import { body, validationResult } from "express-validator";
import { ApplicationError } from "./errorHandler.middleware.js";

const validate = async (req, res, rules) => {
  // 2. run those rules.
  await Promise.all(rules.map((rule) => rule.run(req)));

  // 3. check if there are any errors after running the rules.
  const validationErrors = validationResult(req);
  // console.log(validationErrors);

  // 4. if errros, throw error
  if (!validationErrors.isEmpty()) {
    const errorMsg = validationErrors.array().map((error) => error.msg);
    throw new ApplicationError(400, errorMsg);
  }
};

// validation middleware for "User" data validation

export const validateUserData = async (req, res, next) => {
  // 1. Setup rules for validation.
  const rules = [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 5 })
      .matches(/[-_$#@!%^\*]/)
      .withMessage(
        "The password must be at least 5 characters, and must contain a symbol"
      ),
    body("name").notEmpty().optional().withMessage("Name is required"),
  ];

  try {
    await validate(req, res, rules);
  } catch (err) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  next();
};

// validation middleware for "Post" data validation
export const validatePostData = async (req, res, next) => {
  const rules = [
    body("caption").trim().notEmpty().withMessage("Caption is required"),
    body("imageUrl").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Image is required");
      }
      return true;
    }),
  ];

  try {
    await validate(req, res, rules);
  } catch (err) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  next();
};
