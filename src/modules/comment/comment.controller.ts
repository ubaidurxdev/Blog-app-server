import { Request, Response } from "express";
import { commentService } from "./comment.service";
import { success } from "better-auth/*";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json({
      success: true,
      message: "Comment created",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};

const getCommentsByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentService.getCommentsByAuthorId(
      authorId as string,
    );
    res.status(200).json({
      success: true,
      message: "get Comment By author Id ",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.getCommentById(commentId as string);
    res.status(200).json({
      success: true,
      message: "get Comment By Id ",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const user = req.user;
    const result = await commentService.updateComment(
      commentId as string,
      req.body,
      user?.id as string,
    );
    res.status(200).json({
      success: true,
      message: "get Comment By Id ",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};

const moderateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.moderateComment(
      commentId as string,
      req.body
    );
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (e: any) {
    res.status(404).json({
      success: false,
      message: e,
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentService.deleteComment(
      user?.id as string,
      commentId as string,
    );
    res.status(200).json({
      success: true,
      message: "get Comment By Id ",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};
export const commentController = {
  createComment,
  deleteComment,
  moderateComment,
  updateComment,
  getCommentsByAuthorId,
  getCommentById,
};
