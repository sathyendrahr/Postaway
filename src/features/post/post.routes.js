import express from "express";
import PostController from "./post.controller.js";
import { fileUpload } from "../../middlewares/fileUpload.middleware.js";
import { validatePostData } from "../../middlewares/validation.middleware.js";

const postRouter = express.Router();

const postController = new PostController();

postRouter.get("/", (req, res, next) =>
  postController.getPostsByUser(req, res, next)
);

postRouter.get("/all", (req, res, next) =>
  postController.getAllPosts(req, res, next)
);

postRouter.get("/:id", (req, res, next) =>
  postController.getPostById(req, res, next)
);

postRouter.post(
  "/",
  fileUpload.single("imageUrl"),
  validatePostData,
  (req, res, next) => postController.createPost(req, res, next)
);

postRouter.put("/:id", fileUpload.single("imageUrl"), (req, res, next) =>
  postController.updatePost(req, res, next)
);

postRouter.delete("/:id", (req, res, next) =>
  postController.deletePost(req, res, next)
);

export default postRouter;
