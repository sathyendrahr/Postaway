import FriendshipRepository from "./friendship.repository.js";

export default class FriendshipController {
  constructor() {
    this.friendshipRepository = new FriendshipRepository();
  }

  async getFriends(req, res, next) {
    const userId = req.params.userId;
    try {
      const friends = await this.friendshipRepository.getFriends(userId);

      if (friends == 404)
        return res.status(404).json({
          success: false,
          error: "User not found",
        });

      if (!friends)
        return res.status(200).json({
          success: true,
          message: "No friends found for the user",
        });

      // Transforming result to include only the non null populated data
      // (either userId or friendId)
      const transformedFriends = friends.map(
        (friend) => friend.userId || friend.friendId
      );
      res.status(200).json({
        success: true,
        friends: transformedFriends,
      });
    } catch (err) {
      next(err);
    }
  }

  async getPendingRequests(req, res, next) {
    try {
      const pendingRequests =
        await this.friendshipRepository.getPendingRequests();

      if (!pendingRequests) {
        return res.status(200).json({
          success: true,
          message: "No pending requests",
        });
      }

      res.status(200).json({
        success: true,
        pendingRequests,
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleFriendship(req, res, next) {
    const userId = req.userId;
    const friendId = req.params.friendId;
    try {
      const response = await this.friendshipRepository.toggleFriendship(
        userId,
        friendId
      );

      // If new insert
      if (response == 1)
        res.status(200).json({ success: true, message: "Friend request sent" });
      else if (response == -1)
        res.status(200).json({
          success: true,
          message: "Friend removed",
        });
      else
        res.status(404).json({
          success: false,
          error: "Friend not found",
        });
    } catch (err) {
      next(err);
    }
  }

  async respondToRequest(req, res, next) {
    const userId = req.userId;
    const friendId = req.params.friendId;
    const { response } = req.body;

    if (response != "accept" && response != "reject")
      return res.status(400).json({
        success: false,
        error: "Invalid response",
        message: "response must be either 'accept' or 'reject'",
      });

    try {
      const result = await this.friendshipRepository.respondToRequest(
        userId,
        friendId,
        response
      );

      console.log(result);

      // Handling when friendId is invalid
      if (!result) {
        return res
          .status(404)
          .json({ success: false, error: "Friend not found" });
      }

      // handling when there is no pending request for the given friendId
      if (result == -1) {
        return res
          .status(400)
          .json({ succes: false, message: "No pending request found" });
      }

      if (response == "accept") {
        res.status(200).json({
          success: true,
          message: "Friend request accepted",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Friend request rejected",
        });
      }
    } catch (err) {
      next(err);
    }
  }
}
