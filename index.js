/* This is the main server file */

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import userRouter from "./src/features/user/user.routes.js";
import postRouter from "./src/features/post/post.routes.js";
import commentRouter from "./src/features/comment/comment.routes.js";
import likeRouter from "./src/features/like/like.routes.js";
import friendshipRouter from "./src/features/friendship/friendship.routes.js";
import otpRouter from "./src/features/otp/otp.routes.js";
import { loggerMiddleware } from "./src/middlewares/logger.middleware.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";
import { invalidRoutesHandlerMiddleware } from "./src/middlewares/invalidRoute.middleware.js";
import jwtAuth from "./src/middlewares/jwtAuth.middleware.js";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Postaway",
  });
});

app.use("/api/users", userRouter);
app.use("/api/posts", jwtAuth, postRouter);
app.use("/api/comments", jwtAuth, commentRouter);
app.use("/api/likes", jwtAuth, likeRouter);
app.use("/api/friends", friendshipRouter);
app.use("/api/otp", otpRouter);

app.use(invalidRoutesHandlerMiddleware);

app.use(errorHandler);

export default app;
