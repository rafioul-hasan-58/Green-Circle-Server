import { z } from "zod";

const paymentPayloadSchema = z.object({
  order_id: z.string().min(1, "Order ID is required"),
  customer_phone: z.string().min(10, "Phone number is too short"),
  customer_city: z.string().min(1, "City is required"),
});

export const paymentValidations = { paymentPayloadSchema };
