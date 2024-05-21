import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const LikeModel = mongoose.model("Like", likeSchema);

export default LikeModel;
