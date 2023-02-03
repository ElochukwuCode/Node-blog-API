import { User, Follow } from "../models";

class FollowController {
  static follow_user(req, res) {
    const userId = res.locals.user.id;
    const subjectId = req.params.id;
    Follow.create({
      userId: userId,
      followedId: subjectId,
    })
      // .then(() => {
      //   Follow.create({
      //     userId: subjectId,
      //     followedId: null,
      //     followingId: userId,
      //   });
      // })
      .then(() => {
        return res.status(201).json({
          status: "success",
          message: `${userId} follows ${subjectId}`,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: "Server Error",
        });
      });
  }
  static unfollow_user(req, res) {
    const userId = res.locals.user.id;
    const followedId = req.params.id;
    Follow.destroy({ where: { userId, followedId } })
      .then(() => {
        return res.status(201).json({
          status: "success",
          message: `${userId} unfollowed ${followedId}`,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: "Server Error",
        });
      });
  }
  static get_followed_count(req, res) {
    const userId = res.locals.user.id;
    Follow.findAndCountAll({ where: { userId } })
      .then((result) => {
        return res.status(200).json({
          status: "success",
          message: "Count and record of followed users retrieved",
          data: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: "Server Error",
        });
      });
  }
  static get_following_count(req, res) {
    const userId = res.locals.user.id;
    Follow.findAndCountAll({ where: { followedId: userId } })
      .then((result) => {
        return res.status(200).json({
          status: "success",
          message: "Count and record of following users retrieved",
          data: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: "Server Error",
        });
      });
  }
}

export default FollowController;
