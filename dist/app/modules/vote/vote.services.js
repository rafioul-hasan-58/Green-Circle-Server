"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteServices = void 0;
const prisma_1 = require("../../utils/prisma");
const createVote = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    let isVoteExists;
    let isIdeaExists;
    let isBlogExists;
    if (payload.ideaId) {
        isVoteExists = yield prisma_1.prisma.vote.findUnique({
            where: {
                voterId_ideaId: {
                    voterId: user.userId,
                    ideaId: payload.ideaId
                }
            }
        });
        isIdeaExists = yield prisma_1.prisma.idea.findUnique({
            where: {
                id: payload.ideaId
            }
        });
    }
    if (payload.blogId) {
        isVoteExists = yield prisma_1.prisma.vote.findUnique({
            where: {
                voterId_blogId: {
                    voterId: user.userId,
                    blogId: payload.blogId
                }
            }
        });
        isBlogExists = yield prisma_1.prisma.blog.findUnique({
            where: {
                id: payload.blogId
            }
        });
    }
    if (payload.ideaId && !isIdeaExists) {
        throw new Error("Idea doesnot exists");
    }
    if (payload.blogId && !isBlogExists) {
        throw new Error("Blog doesnot exists");
    }
    let result;
    if (isVoteExists) {
        if ((isVoteExists.blogId === payload.blogId && isVoteExists.voterId === user.userId) || (isVoteExists.ideaId === payload.ideaId && isVoteExists.voterId === user.userId)) {
            result = yield prisma_1.prisma.vote.update({
                where: {
                    id: isVoteExists.id
                },
                data: {
                    value: payload.value
                }
            });
        }
    }
    else {
        result = yield prisma_1.prisma.vote.create({
            data: Object.assign(Object.assign({}, payload), { voterId: user.userId })
        });
    }
    return result;
});
const removeVote = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    let isVoteExists;
    if (payload.ideaId) {
        isVoteExists = yield prisma_1.prisma.vote.findUnique({
            where: {
                voterId_ideaId: {
                    voterId: user.userId,
                    ideaId: payload.ideaId
                }
            }
        });
    }
    else if (payload.blogId) {
        isVoteExists = yield prisma_1.prisma.vote.findUnique({
            where: {
                voterId_blogId: {
                    voterId: user.userId,
                    blogId: payload.blogId
                }
            }
        });
    }
    if (!isVoteExists) {
        throw new Error("Vote is not found");
    }
    const result = yield prisma_1.prisma.vote.delete({
        where: {
            id: isVoteExists.id
        }
    });
    return result;
});
exports.voteServices = {
    createVote,
    removeVote
};
