import { ApplicationError } from "../../middlewares/errorHandler.middleware.js";
import PostRepository from "../post/post.repository.js";
import CommentModel from "./comment.model.js";
import { ObjectId } from "mongodb";

/***********************  CommentRepository class definiton starts here  ************************/

export default class CommentRepository {
  constructor() {
    this.postRepository = new PostRepository();
  }

  // method to add a new comment to a post
  async add(postId, userId, content) {
    const post = await this.postRepository.getPostById(postId);

    if (!post) {
      throw new ApplicationError(404, "Post not found");
    }

    const comment = new CommentModel({ postId, userId, content });
    await comment.save();

    return comment;
  }

  // method to update a comment made by a user
  // only the user who has made that comment can edit the comment
  async update(commentId, userId, content) {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      throw new ApplicationError(404, "Comment not found");
    }

    if (comment.userId.toString() != userId) {
      throw new ApplicationError(
        401,
        "You are unauthorized to modify the comment"
      );
    }

    comment.content = content;
    await comment.save();

    return comment;
  }

  // method to delete a comment made by a user
  // only the user who has made that comment can delete the comment
  async delete(commentId, userId) {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      throw new ApplicationError(404, "Comment not found");
    }

    const deletedComment = await CommentModel.deleteOne({
      _id: ObjectId.createFromHexString(commentId),
      userId: ObjectId.createFromHexString(userId),
    });

    if (deletedComment.deletedCount > 0) return true;

    return false;
  }

  // method returns all comments for a post
  async get(postId) {
    return await CommentModel.find({
      postId: ObjectId.createFromHexString(postId),
    }).populate({ path: "userId", model: "User", select: "name email -_id" });
  }
}
/***********************  CommentModel class definiton ends here  ************************/
