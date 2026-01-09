import { Router } from "express";
import { postController } from "./post.controller";
import { authentication, UserRole } from "../../middleware/authentication";

const router = Router();
router.get("/", postController.getAllPosts);
router.get("/:postId", postController.getPostById);
router.post("/", authentication(UserRole.USER), postController.createPost);

export const postRouter: Router = router;
