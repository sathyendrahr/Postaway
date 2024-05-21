import mongoose, { mongo } from "mongoose";

const friendshipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accept", "reject"],
    required: true,
  },
});

const FriendshipModel = mongoose.model("Friendship", friendshipSchema);

export default FriendshipModel;
