import express from "express";
import FriendshipController from "./friendship.controller.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";

const friendshipRouter = express.Router();
const friendshipController = new FriendshipController();

friendshipRouter.get("/get-friends/:userId", (req, res, next) =>
  friendshipController.getFriends(req, res, next)
);

friendshipRouter.get("/get-pending-requests", (req, res, next) =>
  friendshipController.getPendingRequests(req, res, next)
);

friendshipRouter.get(
  "/toggle-friendship/:friendId",
  jwtAuth,
  (req, res, next) => friendshipController.toggleFriendship(req, res, next)
);

friendshipRouter.post(
  "/response-to-request/:friendId",
  jwtAuth,
  (req, res, next) => friendshipController.respondToRequest(req, res, next)
);

export default friendshipRouter;
