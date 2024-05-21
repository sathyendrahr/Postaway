import { ApplicationError } from "../../middlewares/errorHandler.middleware.js";
import CommentRepository from "./comment.repository.js";

/***********************  CommentController class definiton starts here  ************************/
export default class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async getComments(req, res, next) {
    const postId = req.params.postId;
    try {
      const comments = await this.commentRepository.get(postId);

      if (!comments || comments.length == 0) {
        return res.status(200).json({
          success: true,
          message: "No comments found for the post",
        });
      }
      res.status(200).json({
        success: true,
        comments: comments,
      });
    } catch (err) {
      next(err);
    }
  }

  async addComment(req, res, next) {
    try {
      const postId = req.params.postId;
      const userId = req.userId;

      if (!req.body.content || req.body.content.trim() == "") {
        throw new ApplicationError(
          400,
          "content is required and should not be empty"
        );
      }

      const content = req.body.content.trim();

      const comment = await this.commentRepository.add(postId, userId, content);

      res.status(200).json({
        success: true,
        message: "Comment added",
        comment,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateComment(req, res, next) {
    try {
      const commentId = req.params.commentId;
      const userId = req.userId;

      if (!req.body.content || req.body.content.trim() == "") {
        throw new ApplicationError(
          400,
          "content is required and should not be empty"
        );
      }

      const content = req.body.content.trim();

      const updatedComment = await this.commentRepository.update(
        commentId,
        userId,
        content
      );

      res.status(200).json({
        success: true,
        message: "Comment updated",
        updatedComment,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    const commentId = req.params.commentId;
    const userId = req.userId;

    try {
      const deletedComment = await this.commentRepository.delete(
        commentId,
        userId
      );

      if (!deletedComment) {
        return res.status(400).json({
          success: false,
          message: "Comment can't be deleted",
        });
      }

      res.status(200).json({
        success: true,
        message: "Comment deleted",
      });
    } catch (err) {
      next(err);
    }
  }
}

/***********************  CommentModel class definiton ends here  ************************/
