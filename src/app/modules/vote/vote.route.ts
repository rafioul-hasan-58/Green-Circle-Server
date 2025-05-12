import { Router } from "express";
import { voteController } from "./vote.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../../../generated/prisma";



const router = Router();

router.post("/create-vote",auth(userRole.admin,userRole.member),voteController.createVote);
router.delete("/remove-vote",auth(userRole.admin,userRole.member),voteController.removeVote)

export const voteRouter = router;