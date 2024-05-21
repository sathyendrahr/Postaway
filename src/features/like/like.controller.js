import LikeRepository from "./like.repository.js";

/***********************  LikeController class definiton starts here  ************************/
export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async getLikes(req, res, next) {
    const postId = req.params.id;

    try {
      const likes = await this.likeRepository.getAll(postId);

      if (!likes || likes.length == 0) {
        return res.status(200).json({
          success: true,
          message: "No likes for the post yet",
        });
      }

      res.status(200).json({
        success: true,
        likes,
      });
    } catch (err) {
      next(err);
    }
  }

  // This method toggles the like of a post, if it has a like by a user, then removes it, and vice versa
  async toggleLike(req, res, next) {
    const postId = req.params.id;
    const userId = req.userId;

    try {
      const response = await this.likeRepository.toggleLike(postId, userId);

      if (response == 1) {
        res.status(200).json({
          success: true,
          message: "Like added",
        });
      } else if (response == -1) {
        res.status(200).json({
          success: true,
          message: "Like removed",
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

/***********************  LikeController class definiton ends here  ************************/
