import { Router } from "express";
import { postController } from "./post.controller";
import { authentication, UserRole } from "../../middleware/authentication";

const router = Router();
router.get("/", postController.getAllPosts);

router.get("/stats", authentication(UserRole.ADMIN), postController.getStats);

router.get(
  "/my-posts",
  authentication(UserRole.USER, UserRole.ADMIN),
  postController.getMyPosts,
);

router.patch(
  "/:postId",
  authentication(UserRole.USER, UserRole.ADMIN),
  postController.updatePost,
);
router.get("/:postId", postController.getPostById);

router.post("/", authentication(UserRole.USER), postController.createPost);

router.post(
  "/:postId",
  authentication(UserRole.USER, UserRole.ADMIN),
  postController.deletePost,
);

export const postRouter: Router = router;
