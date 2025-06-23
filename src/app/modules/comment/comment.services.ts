import status from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../utils/prisma";
import { IAuthUser } from "../user/user.interface";
import { IComment } from "./comment.interface";

const createComment = async (payload: IComment, user: IAuthUser) => {
  const result = prisma.comment.create({
    data: {
      ...payload,
      commenterId: user.userId,
    },
  });
  return result;
};

const editComment = async (
  id: string,
  payload: { content: string },
  user: IAuthUser
) => {
  const commentData = await prisma.comment.findUnique({
    where: {
      id,
    },
  });
  if (!commentData) {
    throw new AppError(status.NOT_FOUND, "Comment not found!");
  }
  if (commentData?.commenterId !== user.userId) {
    throw new Error("You cannot update this comment");
  }
  const result = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      content: payload.content,
    },
  });
  return result;
};
const deleteComment = async (id: string, user: IAuthUser) => {
  const commentData = await prisma.comment.findUnique({
    where: {
      id,
    },
  });
  if (!commentData) {
    throw new AppError(status.NOT_FOUND, "Comment not found!");
  }
  if (commentData?.commenterId !== user.userId) {
    throw new Error("You cannot delete this comment");
  }
  const result = await prisma.comment.delete({
    where: {
      id,
    },
  });
  return result;
};
export const commentService = {
  createComment,
  editComment,
  deleteComment,
};
