import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IAuthUser } from "../user/user.interface";
import status from "http-status";
import { paymentServices } from "./payment.services";

const makePayment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { user } = req;
    const result = await paymentServices.makePayment(
      req.body,
      user as IAuthUser,
      req.ip!
    );
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Payment made Successfully",
      data: result,
    });
  }
);
const verifyPayment = catchAsync(async (req, res) => {
  const { order_id } = req.params;
  const result = await paymentServices.verifyPayment(order_id);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Payment verified Successfully",
    data: result,
  });
});
const getOrderWhichPayMe = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { user } = req;
    const result = await paymentServices.getOrderWhichPayMe(user as IAuthUser);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Payment is retrieved Successfully",
      data: result,
    });
  }
);
const getAllOrder = catchAsync(async (req, res) => {
  const result = await paymentServices.getAllOrder();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payments are retrieved Successfully",
    data: result,
  });
});

const getSinglePayment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { user } = req;
    const { ideaId } = req.params;
    const result = await paymentServices.getSinglePayment(
      user as IAuthUser,
      ideaId
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Payment is retrieved Successfully",
      data: result,
    });
  }
);

export const paymentControllers = {
  makePayment,
  verifyPayment,
  getOrderWhichPayMe,
  getSinglePayment,
  getAllOrder,
};
