import { prisma } from "../../utils/prisma";
import { IAuthUser } from "../user/user.interface";
import { Blog, Prisma, userRole } from "../../../../generated/prisma";
import { TBlogFilterRequest } from "./blog.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { blogSearchableFields } from "./blog.constant";
import calculatePagination from "../../utils/calculatePagination";
import AppError from "../../errors/AppError";
import status from "http-status";

const writeBlog = async (payload: Blog, user: IAuthUser) => {
  if (!user.userId) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }
  if (user?.email === "member@demo.com") {
    throw new AppError(
      status.FORBIDDEN,
      "Demo user cannot create blog. Please register first"
    );
  }
  const result = await prisma.blog.create({
    data: {
      ...payload,
      authorId: user?.userId,
    },
  });
  return result;
};

const getAllBlogs = async (
  filters: TBlogFilterRequest,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, author, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const andCondition: Prisma.BlogWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: blogSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (author) {
    andCondition.push({
      author: {
        name: {
          contains: author,
          mode: "insensitive",
        },
      },
    });
  }
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: filterData[key as keyof typeof filterData],
      },
    }));
    andCondition.push(...filterConditions);
  }
  const whereConditions: Prisma.BlogWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.blog.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      Vote: true,
      author: true,
    },
  });

  const total = await prisma.blog.count({
    where: whereConditions,
  });
  const totalPage = Math.max(1, Math.ceil(total / limit));
  const enhancedIdeas = result.map((blog) => {
    const votes = blog.Vote || [];

    const upVotes = votes.filter((v) => v.value === "up").length;
    const downVotes = votes.filter((v) => v.value === "down").length;

    return {
      ...blog,
      up_votes: upVotes,
      down_votes: downVotes,
      total_votes: upVotes + downVotes,
    };
  });
  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: enhancedIdeas,
  };
};
const getMyBlogs = async (
  filters: TBlogFilterRequest,
  paginationOptions: IPaginationOptions,
  user: IAuthUser
) => {
  const { searchTerm, author, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const andCondition: Prisma.BlogWhereInput[] = [];
  andCondition.push({
    authorId: user.userId,
  });
  if (searchTerm) {
    andCondition.push({
      OR: blogSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (author) {
    andCondition.push({
      author: {
        name: {
          contains: author,
          mode: "insensitive",
        },
      },
    });
  }
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: filterData[key as keyof typeof filterData],
      },
    }));
    andCondition.push(...filterConditions);
  }
  const whereConditions: Prisma.BlogWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.blog.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      Vote: true,
      author: true,
    },
  });

  const total = await prisma.blog.count({
    where: whereConditions,
  });
  const enhancedIdeas = result.map((blog) => {
    const votes = blog.Vote || [];

    const upVotes = votes.filter((v) => v.value === "up").length;
    const downVotes = votes.filter((v) => v.value === "down").length;

    return {
      ...blog,
      up_votes: upVotes,
      down_votes: downVotes,
    };
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: enhancedIdeas,
  };
};

const getBlog = async (id: string) => {
  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
    include: {
      Vote: true,
    },
  });
  const up_votes = result?.Vote.filter((v) => v.value === "up").length;
  const down_votes = result?.Vote.filter((v) => v.value === "down").length;
  return {
    ...result,
    up_votes,
    down_votes,
  };
};

const editBlog = async (
  id: string,
  payload: Partial<Blog>,
  user: IAuthUser
) => {
  const blogData = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  if (blogData?.authorId !== user.userId && user.role !== userRole.admin) {
    throw new Error("You cannot update this blog");
  }
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const removeImage = async (id: string, image: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
    select: {
      images: true,
    },
  });
  const finalImages = blog?.images?.filter((img) => img !== image);
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: {
      images: finalImages,
    },
  });
  return result;
};

const deleteBlog = async (id: string, user: IAuthUser) => {
  const blogData = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  if (blogData?.authorId !== user.userId && user.role !== userRole.admin) {
    throw new Error("You cannot delete this blog");
  }
  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return result;
};
export const blogServices = {
  writeBlog,
  getAllBlogs,
  getBlog,
  editBlog,
  deleteBlog,
  getMyBlogs,
  removeImage,
};
