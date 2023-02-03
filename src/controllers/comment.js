import { CommentLike, Comment } from "../models";

class CommentController {
  static create_comment(req, res) {
    const { comment } = req.body;
    const postId = req.params.id;
    const userId = res.locals.user.id;
    Comment.create({
      comment: comment,
      userId: userId,
      postId: postId,
    })
      .then((newComment) => {
        res.status(201).json({
          status: "success",
          message: "Comment created!",
          data: newComment,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: "Server Error",
          error: err,
        });
        console.log(err);
      });
  }
  static async edit_comment(req, res) {
    const commentId = req.params.commentId;
    const userId = res.locals.user.id;
    const foundComment = await Comment.findOne({ where: { id: commentId } });
    if (foundComment.userId === userId) {
      Comment.update(req.body, { where: { id: commentId } })
        .then(() => {
          res.status(200).json({
            status: "success",
            message: "comment updated!",
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: "error",
            message: "internal server error",
          });
        });
    } else {
      res.status(401).json({
        status: "error",
        message: "Unauthorized User!",
      });
    }
  }
  static async delete_comment(req, res) {
    const commentId = req.params.commentId;
    const userId = res.locals.user.id;
    const foundComment = await Comment.findOne({ where: { id: commentId } });
    if (foundComment.userId === userId) {
      Comment.destroy({ where: { id: commentId } })
        .then(() => {
          res.status(200).json({
            status: "success",
            message: "Comment deleted",
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: "error",
            message: "internal server error",
          });
        });
    } else {
      res.status(401).json({
        status: "error",
        message: "Unauthorized User!",
      });
    }
  }
  static async like_comment(req, res) {
    const id = res.locals.user.id;
    const commentId = req.params.commentId;
    try {
      const isCommentLike = await CommentLike.findOne({
        where: { commentId: commentId },
      });
      if (isCommentLike) {
        let likeCount = isCommentLike.likeCount;
        const userIdArray = isCommentLike.userId;
        if (!userIdArray.includes(id)) {
          likeCount++;
          userIdArray.push(id);
          await CommentLike.update(
            { likeCount: likeCount, userId: userIdArray },
            { where: { commentId: commentId } }
          );
          res.status(200).json({
            status: "success",
            message: "Comment Liked",
          });
        } else {
          return res.status(403).json({
            status: "error",
            message: "Comment already liked by user",
          });
        }
      } else {
        const userId2 = [];
        userId2.push(id);
        CommentLike.create({
          userId: userId2,
          commentId: commentId,
          likeCount: 1,
        })
          .then(() => {
            res.status(200).json({
              status: "success",
              message: "Comment Liked!",
            });
          })
          .catch((err) => {
            res.status(500).json({
              status: "error",
              message: "Internal server error",
            });
          });
      }
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
  static async unlike_comment(req, res) {
    const id = res.locals.user.id;
    const commentId = req.params.commentId;
    try {
      const isCommentLike = await CommentLike.findOne({
        where: { commentId: commentId },
      });
      let likeCount = isCommentLike.likeCount;
      const userIdArray = isCommentLike.userId;
      if (userIdArray.includes(id)) {
        likeCount--;
        userIdArray.splice(indexOf(id), 1);
        await CommentLike.update(
          { likeCount: likeCount, userId: userIdArray },
          { where: { commentId: commentId } }
        );
        res.status(200).json({
          status: "success",
          message: "Comment UnlLiked!",
        });
      } else {
        return res.status(401).json({
          status: "error",
          message: "unauthorized user",
        });
      }
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
  static get_all_comments(req, res) {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    let size = 25;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 25) {
      size = sizeAsNumber;
    }
    Comment.findAndCountAll(
      { limit: size, offset: page * size },
      { where: { postId: req.params.id } }
    )
      .then((comments) => {
        res.status(200).json({
          status: "success",
          message: "Comments retrieved",
          data: comments,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: "Server Error",
        });
      });
  }
  static get_one_comment(req, res) {
    Comment.findOne({ where: { id: req.params.commentId } })
      .then((comment) => {
        res.status(200).json({
          status: "success",
          message: "Comment retrieved",
          data: comment,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: "Server Error",
        });
      });
  }
  static async get_comment_likes(req, res) {
    const commentId = req.params.commentId;
    try {
      const commentLikeResult = await CommentLike.findOne({
        where: { commentId },
      });
      res.status(200).json({
        status: "success",
        message: "Comment retrieved",
        data: commentLikeResult,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Server Error",
      });
    }
  }
}

export default CommentController;
