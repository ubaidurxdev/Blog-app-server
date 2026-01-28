import { Router } from "express";
import { commentController } from "./comment.controller";
import { authentication, UserRole } from "../../middleware/authentication";

const router = Router();
router.get("/author/:authorId", commentController.getCommentsByAuthorId);
router.get("/:commentId", commentController.getCommentById);

router.post(
  "/",
  authentication(UserRole.USER, UserRole.ADMIN),
  commentController.createComment,
);

router.patch(
  "/:commentId",
  authentication(UserRole.USER, UserRole.ADMIN),
  commentController.updateComment,
);

router.patch(
  "/moderate/:commentId",
  authentication(UserRole.ADMIN),
  commentController.moderateComment,
);

router.delete(
  "/:commentId",
  authentication(UserRole.USER, UserRole.ADMIN),
  commentController.deleteComment,
);
export const commentRouter: Router = router;
