import { z } from "zod";

export const userRoleEnum = z.enum(["admin", "member"]);

export const createUserValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email address"),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
  image: z.string({
    required_error: "Image is required",
    invalid_type_error: "Image must be a string",
  }),
});
export const updateUserValidationSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
});
