"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteRouter = void 0;
const express_1 = require("express");
const vote_controller_1 = require("./vote.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const prisma_1 = require("../../../../generated/prisma");
const router = (0, express_1.Router)();
router.post("/create-vote", (0, auth_1.default)(prisma_1.userRole.admin, prisma_1.userRole.member), vote_controller_1.voteController.createVote);
router.delete("/remove-vote", (0, auth_1.default)(prisma_1.userRole.admin, prisma_1.userRole.member), vote_controller_1.voteController.removeVote);
router.post("/isvoted", (0, auth_1.default)(prisma_1.userRole.member, prisma_1.userRole.admin), vote_controller_1.voteController.isVoted);
exports.voteRouter = router;
