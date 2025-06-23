import status from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../utils/prisma";
import { IAuthUser } from "../user/user.interface";
import { paymentUtils } from "./payment.utils";

const makePayment = async (
  payload: TPaymentPayload,
  user: IAuthUser,
  client_ip: string
) => {
  const isExistUser = await prisma.user.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!isExistUser) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }

  const isIdeaExists = await prisma.idea.findUnique({
    where: {
      id: payload?.order_id,
      isDeleted: false,
    },
  });

  if (!isIdeaExists) {
    throw new AppError(status.NOT_FOUND, "Idea not found!");
  }
  if (isIdeaExists.isPremium === false) {
    throw new AppError(status.BAD_REQUEST, "This idea is free!");
  }
  if (isIdeaExists.price < "1") {
    throw new AppError(status.BAD_REQUEST, "This idea is free!");
  }

  const paymentData = {
    amount: isIdeaExists?.price,
    order_id: payload?.order_id,
    currency: "BDT",
    customer_name: isExistUser?.name || payload?.customer_name,
    customer_address:
      isExistUser?.address || payload?.customer_address || "West Datta Para",
    customer_email: user?.email,
    customer_phone: payload?.customer_phone,
    customer_city: payload?.customer_city,
    idea_title: isIdeaExists?.title,
    client_ip,
  };

  const isPaymentExists = await prisma.payment.findUnique({
    where: {
      ideaId_authorId: {
        ideaId: isIdeaExists?.id,
        authorId: isIdeaExists?.authorId,
      },
      isDeleted: false,
    },
  });

  if (isPaymentExists?.status === "paid") {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment has already been completed"
    );
  }
  if (isPaymentExists) {
    throw new AppError(status.BAD_REQUEST, "Payment already initialize!");
  }

  const result = await paymentUtils.makePaymentAsync(paymentData);
  const amount = Number(result.amount);
  if (result?.transactionStatus) {
    const res = await prisma.payment.create({
      data: {
        ideaId: isIdeaExists?.id,
        ideaTitle: isIdeaExists?.title,
        authorId: user?.userId,
        amount: amount,
        transactionId: result?.sp_order_id,
      },
    });
  }
  return result?.checkout_url;
};
const verifyPayment = async (order_id: string) => {
  const isPaymentExists = await prisma.payment.findUnique({
    where: {
      transactionId: order_id,
    },
  });
  if (isPaymentExists?.status === "paid") {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment has already been completed"
    );
  }
  const verifyPayment = await paymentUtils.verifyPaymentAsync(order_id);
  let result;
  if (verifyPayment?.length) {
    result = await prisma.payment.update({
      where: {
        transactionId: order_id,
      },
      data: {
        status:
          verifyPayment[0]?.bank_status === "Success"
            ? "paid"
            : verifyPayment[0]?.bank_status === "Failed"
            ? "unpaid"
            : "pending",
      },
    });
  }
  return verifyPayment;
};
const getOrderWhichPayMe = async (user: IAuthUser) => {
  const result = await prisma.payment.findMany({
    where: {
      authorId: user?.userId,
    },
  });
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Payment not found!");
  }
  return result;
};
const getAllOrder = async () => {
  const result = await prisma.payment.findMany();
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Payments not found!");
  }
  return result;
};
const getSinglePayment = async (user: IAuthUser, ideaId: string) => {
  const result = await prisma.payment.findUnique({
    where: {
      ideaId_authorId: {
        ideaId: ideaId,
        authorId: user?.userId,
      },
    },
  });
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Payment not found!");
  }
  return result;
};

export const paymentServices = {
  makePayment,
  verifyPayment,
  getOrderWhichPayMe,
  getSinglePayment,
  getAllOrder,
};
