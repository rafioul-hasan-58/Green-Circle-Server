import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { userServices } from "./user.service";
import { IAuthUser } from "./user.interface";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { result, accessToken } = await userServices.registerUser(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User Registered Successfully",
    data: { data: result, accessToken },
  });
});
const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { user } = req;
    const result = await userServices.getMyProfile(user as IAuthUser);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "My Profile Retrieved Successfully",
      data: result,
    });
  }
);
const updateUser = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { user, body } = req;
    const result = await userServices.updateUser(user as IAuthUser, body);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User updated Successfully",
      data: result,
    });
  }
);
const deleteUser = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { user } = req;
    const { id } = req.params;
    await userServices.deleteUser(user as IAuthUser, id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User deleted Successfully",
      data: null,
    });
  }
);

const getAllUserFromDb = catchAsync(async (req, res) => {
  const result = await userServices.getAllUserFromDb();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users are Retrieved Successfully",
    data: result,
  });
});
const getSingleUserFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.getSingleUserFromDb(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User is Retrieved Successfully",
    data: result,
  });
});

export const userController = {
  registerUser,
  getMyProfile,
  deleteUser,
  updateUser,
  getAllUserFromDb,
  getSingleUserFromDb,
};
