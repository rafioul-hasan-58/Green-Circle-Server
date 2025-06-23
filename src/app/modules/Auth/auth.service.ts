import config from "../../config";
import { jwtHelpers } from "../../utils/jwt.helpers";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IAuthUser } from "../user/user.interface";
import sendEmail from "./sendEmail";
import AppError from "../../errors/AppError";
import status from "http-status";

const login = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new AppError(status.NOT_ACCEPTABLE, "Password doesn't match");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
      userId: userData.id,
    },
    config.jwt_secret as string,
    (config.jwt_expires_in as string) || "1d"
  );
  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
      userId: userData.id,
    },
    config.jwt_refresh_secret as string,
    (config.jwt_refresh_expires_in as string) || "1d"
  );
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: userData.needsPasswordChange,
    role: userData.role,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwt.verify(token, config.jwt_refresh_secret as string);
  } catch (err) {
    throw new AppError(status.UNAUTHORIZED, "You are not authorized");
  }
  if (typeof decodedData === "string" || !("email" in decodedData)) {
    throw new AppError(status.NOT_ACCEPTABLE, "Invalid token payload");
  }
  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData.email,
    },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
      userId: userData.id,
    },
    config.jwt_secret as string,
    config.jwt_expires_in as string
  );
  return { accessToken };
};

const changePassword = async (
  user: IAuthUser,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new AppError(status.NOT_ACCEPTABLE, "Password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needsPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role, userId: userData.id },
    config.reset_password_secret as string,
    config.reset_password_expires_in as string
  );

  const resetPassLink =
    config.reset_password_link +
    `?userId=${userData.id}&token=${resetPassToken}`;

  await sendEmail(
    userData.email,
    `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
  );
};
const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }
  const isValidToken = jwt.verify(
    token,
    config.reset_password_secret as string
  );

  if (!isValidToken) {
    throw new AppError(status.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const password = await bcrypt.hash(payload.password, 12);

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
};
export const AuthServices = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
