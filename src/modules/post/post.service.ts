import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middleware/authentication";

const getAllPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  sortBy,
  sortOrder,
  skip,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus;
  authorId: string | undefined;
  limit: number;
  skip: number;
  page: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: PostWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }
  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags,
      },
    });
  }
  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured,
    });
  }
  if (status) {
    andConditions.push({
      status,
    });
  }
  if (authorId) {
    andConditions.push({
      authorId,
    });
  }
  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: { select: { comments: true } },
    },
  });
  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: { createdAt: "asc" },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                  orderBy: { createdAt: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return postData;
  });
};

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getMyPosts = async (authorId: string) => {
  return await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
};

const updatePosts = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean,
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not the owner/creator of the post!");
  }
  if (!isAdmin) {
    delete data.isFeatured;
  }
  return await prisma.post.update({
    where: {
      id: postData.id,
    },
    data,
  });
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  if (!isAdmin && authorId !== postData.authorId) {
    throw new Error("You are not the author of this post");
  }
  return await prisma.post.delete({
    where: {
      id: postData.id,
    },
  });
};

const getStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComments,
      totalUsers,
      adminCount,
      userCount,
      totalViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
      await tx.post.count({ where: { status: PostStatus.DRAFT } }),
      await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
      await tx.comment.count(),
      await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
      await tx.user.count(),
      await tx.user.count({ where: { role: UserRole.ADMIN } }),
      await tx.user.count({ where: { role: UserRole.USER } }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComments,
      totalUsers,
      adminCount,
      userCount,
      totalViews:totalViews._sum.views,
    };
  });
};
export const postService = {
  createPost,
  getAllPosts,
  getStats,
  getPostById,
  updatePosts,
  getMyPosts,
  deletePost,
};
