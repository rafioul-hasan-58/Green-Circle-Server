import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { ideaServices } from "./idea.service";
import { Request, Response } from "express";
import { IAuthUser } from "../user/user.interface";
import pick from "../../utils/pick";
import { ideaFilterableFields } from "./idea.constant";
import { paginationQueries } from "../../utils/prisma";

const createIdea = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { user } = req;
    const result = await ideaServices.createIdea(req.body, user as IAuthUser);
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Idea Created Successfully",
      data: result,
    });
  }
);
const getAllIdeas = catchAsync(async (req, res) => {
  const ideaFilters = pick(req.query, ideaFilterableFields);
  const paginationOptions = pick(req.query, paginationQueries);
  const result = await ideaServices.getAllIdeas(ideaFilters, paginationOptions);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All Ideas Retrieved Successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getSingleIdea = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ideaServices.getSingleIdea(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Idea is Retrieved Successfully",
    data: result,
  });
});

const getMyIdeas = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const ideaFilters = pick(req.query, ideaFilterableFields);
    const paginationOptions = pick(req.query, paginationQueries);
    const { user } = req;
    const result = await ideaServices.getMyIdeas(
      ideaFilters,
      paginationOptions,
      user as IAuthUser
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "My Ideas Retrieved Successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);
const removeIdeaImage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ideaServices.removeIdeaImage(id, req.body.image);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Image removed Successfully",
    data: result,
  });
});
const updateIdea = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { user } = req;
    const { id } = req.params;
    const result = await ideaServices.updateIdea(
      user as IAuthUser,
      id,
      req.body
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Idea updated Successfully",
      data: result,
    });
  }
);
const deleteIdea = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { user } = req;
    const { id } = req.params;
    const result = await ideaServices.deleteIdea(user as IAuthUser, id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Idea deleted Successfully",
      data: result,
    });
  }
);
export const ideaControllers = {
  createIdea,
  getAllIdeas,
  getSingleIdea,
  getMyIdeas,
  updateIdea,
  deleteIdea,
  removeIdeaImage,
};
