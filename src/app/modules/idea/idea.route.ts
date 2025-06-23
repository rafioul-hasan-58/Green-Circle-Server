import { Router } from "express";
import { ideaControllers } from "./idea.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ideaValidationSchemas } from "./idea.validation";
import auth from "../../middlewares/auth";
import { userRole } from "../../../../generated/prisma";

const router = Router();

router.post(
  "/create-idea",
  auth(userRole.member),
  validateRequest(ideaValidationSchemas.createIdeaValidationSchema),
  ideaControllers.createIdea
);
router.get("/get-all-ideas", ideaControllers.getAllIdeas);
router.get("/get-idea/:id", ideaControllers.getSingleIdea);
router.get(
  "/get-my-ideas",
  auth(userRole.member),
  ideaControllers.getMyIdeas
);
router.patch(
  "/remove-image/:id",
  auth(userRole.member, userRole.admin),
  ideaControllers.removeIdeaImage
);
router.patch(
  "/update-idea/:id",
  auth(userRole.member, userRole.admin),
  validateRequest(ideaValidationSchemas.updateIdeaValidationSchema),
  ideaControllers.updateIdea
);
router.delete(
  "/delete-idea/:id",
  auth(userRole.member, userRole.admin),
  ideaControllers.deleteIdea
);

export const ideaRouter = router;
