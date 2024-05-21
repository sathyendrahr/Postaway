import PostModel from "./post.model.js";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../middlewares/errorHandler.middleware.js";

/***********************  PostRepository class definiton starts here  ************************/

export default class PostRepository {
  /* 
    Method to add a new post
    parameter "draft" indicates whether the post is draft and is boolean value.
    By default, draft is set to false
  */

  async add(postData) {
    postData.userId = ObjectId.createFromHexString(postData.userId);
    const newPost = new PostModel(postData);
    await newPost.save();
    return newPost;
  }

  /*
    method returns all posts
  */
  async getAllPosts() {
    return await PostModel.find().populate({
      path: "userId",
      model: "User",
      select: "name email",
    });
  }

  /*
    method returns all posts by a user
  */
  async getPostsByUser(userId) {
    return await PostModel.find({
      userId: ObjectId.createFromHexString(userId),
    });
  }

  /*
    method returns all posts by Id
  */
  async getPostById(postId) {
    return await PostModel.findById(postId).populate({
      path: "userId",
      model: "User",
      select: "name email",
    });
  }

  /*
    method to update a post
    handles updating caption & image
  */
  async update(postId, userId, postData) {
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new ApplicationError(404, "Post not found");
    }

    const { caption, imageUrl } = postData;

    if (post.userId.toString() != userId) {
      throw new ApplicationError(
        401,
        "You are unauthorized to update the post"
      );
    }

    if (caption && caption.trim() != "") {
      post.caption = caption;
    }

    if (imageUrl && imageUrl.trim() != "") {
      post.imageUrl = imageUrl;
    }

    await post.save();

    return post;
  }

  /*
    method to delete a post
  */
  async delete(postId, userId) {
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new ApplicationError(404, "Post not found");
    }

    const deletedPost = await PostModel.deleteOne({
      _id: ObjectId.createFromHexString(postId),
      userId: ObjectId.createFromHexString(userId),
    });

    if (deletedPost.deletedCount > 0) {
      return true;
    }

    return false;
  }
}

/***********************  PostRepository class definiton ends here  ************************/
