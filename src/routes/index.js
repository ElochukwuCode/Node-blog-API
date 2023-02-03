import { Router } from "express";
import {
  AuthController,
  RouteController,
  FollowController,
  CommentController,
} from "../controllers";
import { createValidator } from "express-joi-validation";
import { userSchema, loginSchema } from "../validators/signup";
import requireAuth from "../middlewares/middleware";

const router = Router();
const validator = createValidator({ passError: true });

router.post("/signup", validator.body(userSchema), AuthController.signup);
router.post("/login", validator.body(loginSchema), AuthController.login);
router.get("/blogs", RouteController.get_blogs);
router.post("/blogs", requireAuth, RouteController.post_blog);
router.get("/blogs/:id", RouteController.get_one_blog);
router.delete("/blogs/:id", requireAuth, RouteController.delete_blog);
router.put("/blogs/:id", requireAuth, RouteController.edit_blog);
router.post(
  "/blogs/:id/comments",
  requireAuth,
  CommentController.create_comment
);
router.get(
  "/blogs/:id/comments",
  requireAuth,
  CommentController.get_all_comments
);
router.get(
  "/blogs/:postId/:commentId",
  requireAuth,
  CommentController.get_one_comment
);
router.delete(
  "/blogs/:postId/:commentId",
  requireAuth,
  CommentController.delete_comment
);
router.put(
  "/blogs/:postId/:commentId",
  requireAuth,
  CommentController.edit_comment
);
router.put("/blogs/:id/like", requireAuth, RouteController.like_blog);
router.put("/blogs/:id/unlike", requireAuth, RouteController.unlike_blog);
router.get(
  "/blogs/:id/like_count",
  requireAuth,
  RouteController.get_post_likes
);
router.put("/users/:id/follow", requireAuth, FollowController.follow_user);
router.put("/users/:id/follow", requireAuth, FollowController.unfollow_user);
router.get(
  "/users/:id/followed_count",
  requireAuth,
  FollowController.get_followed_count
);
router.get(
  "/users/:id/following_count",
  requireAuth,
  FollowController.get_following_count
);

router.put(
  "/blogs/:postId/:commentId/like",
  requireAuth,
  CommentController.like_comment
);
router.put(
  "/blogs/:postId/:commentId/unlike",
  requireAuth,
  CommentController.unlike_comment
);
router.get(
  "/blogs/:postId/:commentId/like_count",
  requireAuth,
  CommentController.get_comment_likes
);

export default router;
