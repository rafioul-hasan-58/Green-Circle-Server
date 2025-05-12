import { Router } from "express";
import { blogController } from "./blog.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../../../generated/prisma";
import validateRequest from "../../middlewares/validateRequest";
import { createBlogValidationSchema } from "./blog.validations";

const router = Router();

router.post(
  "/write-blog",
  validateRequest(createBlogValidationSchema),
  auth(userRole.admin, userRole.member),
  blogController.writeBlog
);
router.get("/get-all-blogs", blogController.getAllBlogs);
router.get("/get-my-blogs", auth(userRole.member), blogController.getMyBlogs);
router.get("/get-single-blog/:id", blogController.getSingleBlog);
router.patch(
  "/update-blog/:id",
  auth(userRole.admin, userRole.member),
  blogController.editBlog
);
router.delete(
  "/delete-blog/:id",
  auth(userRole.admin, userRole.member),
  blogController.deleteBlog
);
router.patch("/remove-image/:id", blogController.removeImage);

export const blogRouter = router;
