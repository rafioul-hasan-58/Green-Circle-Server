import { z } from "zod";

export const ideaStatusEnum = z.enum(["pending", "approved", "rejected"]);
const categoryEnum = z.enum(["energy", "waste", "transportation"]);
export const createIdeaValidationSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: categoryEnum,
  images: z.array(z.string()).optional(),
  authorId: z.string().min(1),
  problem_statement: z.string().min(1),
  proposed_solution: z.string().min(1),
  isPremium: z.boolean().optional(),
  price: z.string().optional(),
  status: ideaStatusEnum.optional(),
});

export const updateIdeaValidationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: categoryEnum.optional(),
  images: z.array(z.string()).optional(),
  authorId: z.string().optional(),
  problem_statement: z.string().optional(),
  proposed_solution: z.string().optional(),
  isPremium: z.boolean().optional(),
  price: z.string().optional(),
  status: ideaStatusEnum.optional(),
});

export const ideaValidationSchemas = {
  createIdeaValidationSchema,
  updateIdeaValidationSchema,
};
