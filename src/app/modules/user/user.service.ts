import config from "../../config";
import AppError from "../../errors/AppError";
import { jwtHelpers } from "../../utils/jwt.helpers";
import { prisma } from "../../utils/prisma";
import { IAuthUser, IUser } from "./user.interface";
import bcrypt from "bcrypt";
import status from "http-status";
const registerUser = async (payload: IUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (isUserExists) {
    throw new AppError(status.NOT_ACCEPTABLE, "This email is already in use");
  }
  const { password } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      address: payload.address,
      image: payload.image,
    },
  });
  if (!result) {
    throw new Error("User not created");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: result.email,
      role: result.role,
      userId: result.id,
    },
    config.jwt_secret as string,
    config.jwt_expires_in as string
  );
  return { result, accessToken };
};

const getMyProfile = async (user: IAuthUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }
  return userData;
};
const updateUser = async (user: IAuthUser, updatedPayload: Partial<IUser>) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (!userData) {
    throw new Error("User not found");
  }
  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: updatedPayload,
  });
  return result;
};
const deleteUser = async (user: IAuthUser, deletedId: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }
  const deletedData = await prisma.user.findUnique({
    where: {
      id: deletedId,
      isDeleted: false,
    },
  });
  if (!deletedData) {
    throw new Error("User not exists");
  }
  if (userData.role !== "admin" && userData.id !== deletedId) {
    throw new Error("You are not authorized to delete");
  }

  const result = await prisma.user.update({
    where: {
      id: deletedId,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

const getAllUserFromDb = async () => {
  const userData = await prisma.user.findMany();
  return userData;
};
const getSingleUserFromDb = async (id: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }
  return userData;
};
export const userServices = {
  registerUser,
  getMyProfile,
  deleteUser,
  updateUser,
  getAllUserFromDb,
  getSingleUserFromDb,
};
