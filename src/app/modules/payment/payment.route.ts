import { Router } from "express";
import { paymentControllers } from "./payment.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../../../generated/prisma";
import validateRequest from "../../middlewares/validateRequest";
import { paymentValidations } from "./payment.validation";

const router = Router();

router.post(
  "/make-payment",
  auth(userRole.member),
  validateRequest(paymentValidations.paymentPayloadSchema),
  paymentControllers.makePayment
);
router.post(
  "/verify-payment/:order_id",
  auth(userRole.member),
  paymentControllers.verifyPayment
);
router.get("/me", auth(userRole.member), paymentControllers.getPaymentForMe);
router.get(
  "/:ideaId",
  auth(userRole.member),
  paymentControllers.getSinglePayment
);

export const paymentRouter = router;
