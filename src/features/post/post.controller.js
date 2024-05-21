import { ApplicationError } from "../../middlewares/errorHandler.middleware.js";
import PostRepository from "./post.repository.js";
import { ObjectId } from "mongodb";

/***********************  PostController class definiton starts here  ************************/

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  async getAllPosts(req, res, next) {
    try {
      const posts = await this.postRepository.getAllPosts();

      if (!posts || posts.length == 0)
        return res
          .status(200)
          .json({ success: true, message: "No posts found" });

      res.status(200).json({
        success: true,
        posts: posts,
      });
    } catch (err) {
      next(err);
    }
  }

  async getPostById(req, res, next) {
    const postId = req.params.id;
    try {
      const post = await this.postRepository.getPostById(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          error: "Post not found",
        });
      }

      res.status(200).json({
        success: true,
        post: post,
      });
    } catch (err) {
      next(err);
    }
  }

  async getPostsByUser(req, res, next) {
    const userId = req.userId;
    try {
      const posts = await this.postRepository.getPostsByUser(userId);
      if (!posts || posts.length == 0)
        return res
          .status(200)
          .json({ success: true, message: "No posts found" });

      res.status(200).json({
        success: true,
        posts: posts,
      });
    } catch (err) {
      next(err);
    }
  }

  async createPost(req, res, next) {
    // console.log(req.body);
    const postData = req.body;
    postData.userId = req.userId;
    postData.imageUrl = req.file.filename;
    try {
      const newPost = await this.postRepository.add(postData);

      if (!newPost) {
        throw new ApplicationError(400, "Post not added");
      }

      res.status(200).json({
        success: true,
        message: "Post added",
        post: newPost,
      });
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req, res, next) {
    const postData = req.body;
    const postId = req.params.id;
    const userId = req.userId;

    if (req.file) {
      postData.imageUrl = req.file.filename;
    }
    try {
      const updatedPost = await this.postRepository.update(
        postId,
        userId,
        postData
      );

      res.status(200).json({
        success: true,
        message: "Post updated",
        updatedPost: updatedPost,
      });
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    const postId = req.params.id;
    const userId = req.userId;

    try {
      const deletedPost = await this.postRepository.delete(postId, userId);

      if (deletedPost) {
        res.status(200).json({
          success: true,
          message: "Post deleted",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Post can't be deleted",
        });
      }
    } catch (err) {
      next(err);
    }
  }
}
/***********************  PostController class definiton ends here  ************************/
