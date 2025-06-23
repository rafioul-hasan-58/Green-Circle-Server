import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { voteServices } from "./vote.services";
import status from "http-status";
import { IAuthUser } from "../user/user.interface";


const createVote = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const result = await voteServices.createVote(req.body, req.user as IAuthUser);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Your vote added Successfully", 
        data: result,
    });
});
const isVoted = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const result = await voteServices.isVoted(req.body, req.user as IAuthUser);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Your voting fetched Successfully", 
        data: result,
    });
});
const removeVote = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const result = await voteServices.removeVote(req.body, req.user as IAuthUser);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Your removed Successfully",
        data: result,
    });
});

export const voteController = {
    createVote,
    removeVote,
    isVoted
}