import PostRepository from "../post/post.repository.js";
import LikeModel from "./like.model.js";
import { ApplicationError } from "../../middlewares/errorHandler.middleware.js";
import { ObjectId } from "mongodb";

/***********************  LikeModel class definiton starts here  ************************/

export default class LikeRepository {
  constructor() {
    this.postRepository = new PostRepository();
  }

  /*
    method returns all likes for a post
  */
  async getAll(postId) {
    const post = await this.postRepository.getPostById(postId);
    if (!post) throw new ApplicationError(404, "Post not found");

    return await LikeModel.find({
      postId: ObjectId.createFromHexString(postId),
    }).populate({ path: "userId", model: "User", select: "name email -_id" });
  }

  /*
    method to toggle like for a post by user
  */
  async toggleLike(postId, userId) {
    const post = await this.postRepository.getPostById(postId);
    if (!post) throw new ApplicationError(404, "Post not found");

    const isLiked = await LikeModel.findOne({
      postId: ObjectId.createFromHexString(postId),
      userId: ObjectId.createFromHexString(userId),
    });

    if (isLiked) {
      // Already post is liked by the user, hence delete the like
      await LikeModel.deleteOne({
        postId: ObjectId.createFromHexString(postId),
        userId: ObjectId.createFromHexString(userId),
      });
      return -1;
    } else {
      const like = new LikeModel({
        postId: ObjectId.createFromHexString(postId),
        userId: ObjectId.createFromHexString(userId),
      });
      await like.save();
      return 1;
    }
  }
}
/***********************  LikeModel class definiton ends here  ************************/
