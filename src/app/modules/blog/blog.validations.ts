import { z } from "zod";
const categoryEnum = z.enum(["energy", "waste", "transportation"]);
export const createBlogValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  images: z.array(z.string().url("Each image must be a valid URL")),
  description: z.string().min(1, "Description is required"),
  category: categoryEnum,
});

export const updateBlogValidationSchema = createBlogValidationSchema.partial();
