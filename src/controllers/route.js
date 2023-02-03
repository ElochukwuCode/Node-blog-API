import { Post, Comment, PostLike } from "../models";

class RouteController {
  static get_blogs(req, res) {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    let size = 10;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
      size = sizeAsNumber;
    }

    Post.findAndCountAll({ limit: size, offset: page * size })
      .then((posts) => {
        res.status(200).json({
          status: "success",
          message: "Blog posts retrieved",
          data: posts,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: "Server Error",
        });
      });
  }
  static async get_one_blog(req, res) {
    const id = req.params.id;
    try {
      const post = await Post.findOne({ where: { id: id } });
      const comments = await Comment.findAll({ where: { postId: id } });
      res.status(200).json({
        status: "success",
        message: "blog post retrieved",
        data: { ...post, comments },
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Server Error",
      });
    }
  }
  static async post_blog(req, res) {
    const { title, snippet, body } = req.body;
    const userId = res.locals.user.id;
    try {
      const savedPost = await Post.create({
        title: title,
        snippet: snippet,
        body: body,
        userId: userId,
      });

      return res.status(201).json({
        status: "success",
        message: "blog post saved",
        data: savedPost,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Server Error",
      });
    }
  }
  static async delete_blog(req, res) {
    const id = req.params.id;
    const userId = res.locals.user.id;
    const foundBlog = await Post.findOne({ where: { id } });
    if (foundBlog.userId === userId) {
      Post.destroy({ where: { id } })
        .then(() => {
          res.status(200).json({
            status: "success",
            message: "post deleted!",
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
        message: "Unauthorized user!",
      });
    }
  }
  static async edit_blog(req, res) {
    const id = req.params.id;
    const userId = res.locals.user.id;
    const foundBlog = await Post.findOne({ where: { id } });
    if (foundBlog.userId === userId) {
      Post.update(req.body, { where: { id } })
        .then(() => {
          res.status(200).json({
            status: "success",
            message: "post updated!",
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
        message: "Unauthorized user!",
      });
    }
  }
  static async like_blog(req, res) {
    const userId = res.locals.user.id;
    const postId = req.params.id;
    try {
      const checkIfLiked = await PostLike.findOne({
        Where: { postId: postId, userId: userId },
      });
      if (!checkIfLiked) {
        PostLike.create({
          userId,
          postId,
        })
          .then(() => {
            res.status(201).json({
              status: "success",
              message: "Post liked",
            });
          })
          .catch((err) => {
            res.status(500).json({
              status: "error",
              message: "internal error",
            });
          });
      } else {
        return res.status(401).json({
          status: "error",
          message: "Already liked",
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Internal error",
      });
    }
  }
  static async unlike_blog(req, res) {
    const userId = res.locals.user.id;
    const postId = req.params.id;
    try {
      const verifyLike = await PostLike.findOne({ where: { postId, userId } });
      if (verifyLike) {
        PostLike.destroy({ where: { userId, postId } })
          .then(() => {
            res.status(200).json({
              status: "success",
              message: "Post unliked",
            });
          })
          .catch((err) => {
            return res.status(500).json({
              status: "error",
              message: "Internal error",
            });
          });
      } else {
        return res.status(401).json({
          status: "error",
          message: "verification error",
        });
      }
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "internal error",
      });
    }
  }
  static get_post_likes(req, res) {
    const postId = req.params.id;
    PostLike.findAndCountAll({ where: { postId } })
      .then((result) => {
        res.status(200).json({
          status: "success",
          message: "record retrieved",
          data: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: "internal error",
        });
      });
  }
}

export default RouteController;
