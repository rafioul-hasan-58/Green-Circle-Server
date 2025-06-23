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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ideaServices = void 0;
const prisma_1 = require("../../../../generated/prisma");
const calculatePagination_1 = __importDefault(require("../../utils/calculatePagination"));
const prisma_2 = require("../../utils/prisma");
const idea_constant_1 = require("./idea.constant");
const createIdea = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.userId) {
        throw new Error("User not found");
    }
    const result = yield prisma_2.prisma.idea.create({
        data: Object.assign(Object.assign({}, payload), { authorId: user.userId }),
        include: {
            author: true,
        },
    });
    return result;
});
const getAllIdeas = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, author } = filters, filterData = __rest(filters, ["searchTerm", "author"]);
    const { limit, page, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(paginationOptions);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: idea_constant_1.ideaSearchAbleFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    andCondition.push({
        isDeleted: false,
    });
    if (author) {
        andCondition.push({
            author: {
                name: {
                    contains: author,
                    mode: "insensitive",
                },
            },
        });
    }
    // add filterData condition
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: filterData[key],
            },
        }));
        andCondition.push(...filterConditions);
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_2.prisma.idea.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
            Vote: true,
            author: true,
        },
    });
    const total = yield prisma_2.prisma.idea.count({
        where: whereConditions,
    });
    const totalPage = Math.max(1, Math.ceil(total / limit));
    const enhancedIdeas = result.map((idea) => {
        const votes = idea.Vote || [];
        const upVotes = votes.filter((v) => v.value === "up").length;
        const downVotes = votes.filter((v) => v.value === "down").length;
        return Object.assign(Object.assign({}, idea), { up_votes: upVotes, down_votes: downVotes, total_votes: upVotes + downVotes });
    });
    return {
        meta: {
            total,
            page,
            limit,
            totalPage,
        },
        data: enhancedIdeas,
    };
});
const getMyIdeas = (filters, paginationOptions, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, author } = filters, filterData = __rest(filters, ["searchTerm", "author"]);
    const { limit, page, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(paginationOptions);
    const andCondition = [];
    andCondition.push({
        authorId: user.userId,
        isDeleted: false,
    });
    if (searchTerm) {
        andCondition.push({
            OR: idea_constant_1.ideaSearchAbleFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (author) {
        andCondition.push({
            author: {
                name: {
                    contains: author,
                    mode: "insensitive",
                },
            },
        });
    }
    // add filterData condition
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: filterData[key],
            },
        }));
        andCondition.push(...filterConditions);
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_2.prisma.idea.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
            Vote: true,
            author: true,
        },
    });
    const total = yield prisma_2.prisma.idea.count({
        where: whereConditions,
    });
    const enhancedIdeas = result.map((idea) => {
        const votes = idea.Vote || [];
        const upVotes = votes.filter((v) => v.value === "up").length;
        const downVotes = votes.filter((v) => v.value === "down").length;
        return Object.assign(Object.assign({}, idea), { up_votes: upVotes, down_votes: downVotes, total_votes: upVotes + downVotes });
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: enhancedIdeas,
    };
});
const getSingleIdea = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isIdeaExists = yield prisma_2.prisma.idea.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!isIdeaExists) {
        throw new Error("Idea not found");
    }
    const result = yield prisma_2.prisma.idea.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new Error("No idea found");
    }
    return result;
});
const removeIdeaImage = (id, image) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const idea = yield prisma_2.prisma.idea.findUnique({
        where: {
            id,
        },
    });
    const updatedImage = (_a = idea === null || idea === void 0 ? void 0 : idea.images) === null || _a === void 0 ? void 0 : _a.filter((img) => img !== image);
    const result = yield prisma_2.prisma.idea.update({
        where: {
            id,
        },
        data: {
            images: updatedImage,
        },
    });
    return result;
});
const updateIdea = (user, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.userId) {
        throw new Error("User not found");
    }
    const isIdeaExists = yield prisma_2.prisma.idea.findUnique({
        where: {
            id,
        },
    });
    if (!isIdeaExists) {
        throw new Error("Idea not found");
    }
    if (user.userId !== isIdeaExists.authorId && user.role !== prisma_1.userRole.admin) {
        throw new Error("You cannot update this");
    }
    const result = yield prisma_2.prisma.idea.update({
        where: {
            id,
            isDeleted: false,
        },
        data: payload,
    });
    return result;
});
const deleteIdea = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.userId) {
        throw new Error("User not found");
    }
    const isIdeaExists = yield prisma_2.prisma.idea.findUnique({
        where: {
            id,
        },
    });
    if (!isIdeaExists) {
        throw new Error("Idea not found");
    }
    if (user.userId !== isIdeaExists.authorId && user.role !== prisma_1.userRole.admin) {
        throw new Error("You cannot delete this");
    }
    const result = yield prisma_2.prisma.idea.update({
        where: {
            id,
            isDeleted: false,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
exports.ideaServices = {
    createIdea,
    getAllIdeas,
    getMyIdeas,
    getSingleIdea,
    updateIdea,
    deleteIdea,
    removeIdeaImage,
};
