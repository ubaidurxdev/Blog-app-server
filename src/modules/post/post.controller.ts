import { Request, Response } from "express";
import { postService } from "./post.service";
import { success } from "better-auth/*";

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const result = await postService.getAllPosts();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(
      req.body,
      req.user?.id as string
    );
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const postController = {
  createPost,
  getAllPosts,
};
