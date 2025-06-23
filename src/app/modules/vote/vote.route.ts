import { Router } from "express";
import { voteController } from "./vote.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../../../generated/prisma";



const router = Router();

router.post("/create-vote", auth(userRole.admin, userRole.member), voteController.createVote);
router.delete("/remove-vote", auth(userRole.admin, userRole.member), voteController.removeVote)
router.post("/isvoted", auth(userRole.member, userRole.admin), voteController.isVoted)
export const voteRouter = router;