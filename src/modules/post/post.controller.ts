import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelpers from "../../helpers/paginationSortingHelpers";
import { success } from "better-auth/*";

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
      : undefined;
    const status = req.query.status as PostStatus;
    const authorId = req.query.authorId as string | undefined;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelpers(
      req.query,
    );
    const result = await postService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      sortOrder,
      sortBy,
      skip,
      limit,
    });
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

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(404).json({ message: "Post id required" });
    }
    const result = await postService.getPostById(postId);
    res.status(200).json({
      success: true,
      message: "Get post by id",
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
      req.user?.id as string,
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

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if(!user) {
      throw new Error("You are not authorized")
    }
    const result = await postService.getMyPosts(user?.id as string);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.log(error)
    res.status(404).json({
      success: false,
      message: "Post fetched failed",
    });
  }
};

export const postController = {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
};
