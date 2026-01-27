import { Router } from "express";
import { commentController } from "./comment.controller";
import { authentication, UserRole } from "../../middleware/authentication";

const router = Router();
router.get("/author/:authorId", commentController.getCommentsByAuthorId)
router.get("/:commentId", commentController.getCommentById);

router.post(
  "/",
  authentication(UserRole.USER, UserRole.ADMIN),
  commentController.createComment,
);
export const commentRouter: Router = router;
