import { Idea, Prisma, userRole } from "../../../../generated/prisma";
import { IPaginationOptions } from "../../interface/pagination";
import calculatePagination from "../../utils/calculatePagination";
import { prisma } from "../../utils/prisma";
import { IAuthUser } from "../user/user.interface";
import { ideaSearchAbleFields } from "./idea.constant";
import { TIdeaFilterRequest } from "./idea.interface";

const createIdea = async (payload: Idea, user: IAuthUser) => {
  if (!user.userId) {
    throw new Error("User not found");
  }
  const result = await prisma.idea.create({
    data: {
      ...payload,
      authorId: user.userId,
    },
    include: {
      author: true,
    },
  });
  return result;
};

const getAllIdeas = async (
  filters: TIdeaFilterRequest,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, author, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const andCondition: Prisma.IdeaWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: ideaSearchAbleFields.map((field) => ({
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
  // add filterData condition
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: filterData[key as keyof typeof filterData],
      },
    }));
    andCondition.push(...filterConditions);
  }

  const whereConditions: Prisma.IdeaWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.idea.findMany({
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
  const total = await prisma.idea.count({
    where: whereConditions,
  });
  const enhancedIdeas = result.map((idea) => {
    const votes = idea.Vote || [];

    const upVotes = votes.filter((v) => v.value === "up").length;
    const downVotes = votes.filter((v) => v.value === "down").length;

    return {
      ...idea,
      up_votes: upVotes,
      down_votes: downVotes,
      total_votes: upVotes + downVotes,
    };
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: enhancedIdeas,
  };
};

const getSingleIdea = async (id: string) => {
  const isIdeaExists = await prisma.idea.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isIdeaExists) {
    throw new Error("Idea not found");
  }
  const result = await prisma.idea.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new Error("No idea found");
  }
  return result;
};

const getMyIdeas = async (user: IAuthUser) => {
  if (user.role !== "member") {
    throw new Error("User is not a member");
  }
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (!isUserExists) {
    throw new Error("User not found");
  }

  const result = await prisma.idea.findMany({
    where: {
      authorId: isUserExists.id,
      isDeleted: false,
    },
    include: {
      author: true,
    },
  });
  if (result.length === 0) {
    throw new Error("No ideas found for this user");
  }
  return result;
};
const updateIdea = async (user: IAuthUser, id: string, payload: Idea) => {
  if (!user.userId) {
    throw new Error("User not found");
  }
  const isIdeaExists = await prisma.idea.findUnique({
    where: {
      id,
    },
  });
  if (!isIdeaExists) {
    throw new Error("Idea not found");
  }

  if (user.userId !== isIdeaExists.authorId && user.role !== userRole.admin) {
    throw new Error("You cannot update this");
  }
  const result = await prisma.idea.update({
    where: {
      id,
      isDeleted: false,
    },
    data: payload,
  });
  return result;
};
const deleteIdea = async (user: IAuthUser, id: string) => {
  if (!user.userId) {
    throw new Error("User not found");
  }
  const isIdeaExists = await prisma.idea.findUnique({
    where: {
      id,
    },
  });
  if (!isIdeaExists) {
    throw new Error("Idea not found");
  }

  if (user.userId !== isIdeaExists.authorId && user.role !== userRole.admin) {
    throw new Error("You cannot delete this");
  }
  const result = await prisma.idea.update({
    where: {
      id,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};
export const ideaServices = {
  createIdea,
  getAllIdeas,
  getMyIdeas,
  getSingleIdea,
  updateIdea,
  deleteIdea,
};
