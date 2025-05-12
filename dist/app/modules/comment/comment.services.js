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
exports.commentService = void 0;
const prisma_1 = require("../../utils/prisma");
const createComment = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = prisma_1.prisma.comment.create({
        data: Object.assign(Object.assign({}, payload), { commenterId: user.userId }),
    });
    return result;
});
const editComment = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const commentData = yield prisma_1.prisma.comment.findUnique({
        where: {
            id,
        },
    });
    if ((commentData === null || commentData === void 0 ? void 0 : commentData.commenterId) !== user.userId) {
        throw new Error("You cannot update this comment");
    }
    const result = yield prisma_1.prisma.comment.update({
        where: {
            id,
        },
        data: {
            content: payload.content,
        },
    });
    return result;
});
const deleteComment = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const commentData = yield prisma_1.prisma.comment.findUnique({
        where: {
            id,
        },
    });
    if ((commentData === null || commentData === void 0 ? void 0 : commentData.commenterId) !== user.userId) {
        throw new Error("You cannot delete this comment");
    }
    const result = yield prisma_1.prisma.comment.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.commentService = {
    createComment,
    editComment,
    deleteComment,
};
