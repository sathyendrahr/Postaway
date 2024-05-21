import UserRepository from "../user/user.repository.js";
import FriendshipModel from "./friendship.model.js";
import { ObjectId } from "mongodb";

const userRepository = new UserRepository();

export default class FriendshipRepository {
  async getFriends(userId) {
    const user = await userRepository.getUserById(userId);

    if (!user) return 404;

    let populatePath;

    const friends = await FriendshipModel.find(
      {
        // We need to consider all the records where status is accept and
        // the provided userId is either the userId or friendId of the friendship object
        $or: [
          { userId: ObjectId.createFromHexString(userId) },
          { friendId: ObjectId.createFromHexString(userId) },
        ],
        status: "accept",
      },
      { userId: 1, friendId: 1, _id: 0 }
    ) // Populate only if the userId or friendId is not equal to the provided userId
      // For non matches, populate returns null and hence transaformation is required on
      // this populated data and is handled in controller
      .populate({
        path: "friendId",
        match: { _id: { $ne: ObjectId.createFromHexString(userId) } },
        select: { password: 0, tokens: 0, __v: 0 },
        model: "User",
      })
      .populate({
        path: "userId",
        match: { _id: { $ne: ObjectId.createFromHexString(userId) } },
        select: { password: 0, tokens: 0, __v: 0 },
        model: "User",
      })
      .exec();

    return friends;
  }

  async getPendingRequests() {
    return await FriendshipModel.find({ status: "pending" });
  }

  async toggleFriendship(userId, friendId) {
    const friend = await userRepository.getUserById(friendId);
    if (!friend) return;

    const condition1 = [
      { userId: ObjectId.createFromHexString(userId) },
      { friendId: ObjectId.createFromHexString(friendId) },
    ];

    const condition2 = [
      { userId: ObjectId.createFromHexString(friendId) },
      { friendId: ObjectId.createFromHexString(userId) },
    ];

    const isFriend = await FriendshipModel.find({
      $or: [
        {
          $and: condition1,
        },
        {
          $and: condition2,
        },
      ],
    });

    // console.log(isFriend);

    if (!isFriend || isFriend.length == 0) {
      await FriendshipModel.create({
        userId: ObjectId.createFromHexString(userId),
        friendId: ObjectId.createFromHexString(friendId),
        status: "pending",
      });
      return 1;
    } else {
      await FriendshipModel.deleteMany({
        $or: [
          {
            $and: condition1,
          },
          {
            $and: condition2,
          },
        ],
      });
      return -1;
    }
  }

  async respondToRequest(userId, friendId, response) {
    const friend = await userRepository.getUserById(friendId);
    if (!friend) return;

    const request = await FriendshipModel.findOne({
      userId: ObjectId.createFromHexString(friendId),
      friendId: ObjectId.createFromHexString(userId),
      status: "pending",
    });

    // console.log(userId, friendId, response);
    // console.log(request);

    if (!request) return -1;

    if (response == "accept") {
      //   console.log("Inserting");
      request.status = response;
      return await request.save();
    } else {
      //   console.log("deleting");
      return await FriendshipModel.deleteOne({
        userId: ObjectId.createFromHexString(friendId),
        friendId: ObjectId.createFromHexString(userId),
        status: "pending",
      });
    }
  }
}
