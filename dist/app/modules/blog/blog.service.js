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
exports.blogServices = void 0;
const prisma_1 = require("../../utils/prisma");
const prisma_2 = require("../../../../generated/prisma");
const blog_constant_1 = require("./blog.constant");
const calculatePagination_1 = __importDefault(require("../../utils/calculatePagination"));
const writeBlog = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.userId) {
        throw new Error("This user not found in the DB");
    }
    const result = yield prisma_1.prisma.blog.create({
        data: Object.assign(Object.assign({}, payload), { authorId: user === null || user === void 0 ? void 0 : user.userId }),
    });
    return result;
});
const getAllBlogs = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, author } = filters, filterData = __rest(filters, ["searchTerm", "author"]);
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(paginationOptions);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: blog_constant_1.blogSearchableFields.map((field) => ({
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
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: filterData[key],
            },
        }));
        andCondition.push(...filterConditions);
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.prisma.blog.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
            Vote: true,
            author: true,
        },
    });
    const total = yield prisma_1.prisma.blog.count({
        where: whereConditions,
    });
    const enhancedIdeas = result.map((blog) => {
        const votes = blog.Vote || [];
        const upVotes = votes.filter((v) => v.value === "up").length;
        const downVotes = votes.filter((v) => v.value === "down").length;
        return Object.assign(Object.assign({}, blog), { up_votes: upVotes, down_votes: downVotes });
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: enhancedIdeas,
    };
});
const getMyBlogs = (filters, paginationOptions, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, author } = filters, filterData = __rest(filters, ["searchTerm", "author"]);
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(paginationOptions);
    const andCondition = [];
    andCondition.push({
        authorId: user.userId,
    });
    if (searchTerm) {
        andCondition.push({
            OR: blog_constant_1.blogSearchableFields.map((field) => ({
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
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: filterData[key],
            },
        }));
        andCondition.push(...filterConditions);
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.prisma.blog.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
            Vote: true,
            author: true,
        },
    });
    const total = yield prisma_1.prisma.blog.count({
        where: whereConditions,
    });
    const enhancedIdeas = result.map((blog) => {
        const votes = blog.Vote || [];
        const upVotes = votes.filter((v) => v.value === "up").length;
        const downVotes = votes.filter((v) => v.value === "down").length;
        return Object.assign(Object.assign({}, blog), { up_votes: upVotes, down_votes: downVotes });
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: enhancedIdeas,
    };
});
const getBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.blog.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const editBlog = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const blogData = yield prisma_1.prisma.blog.findUnique({
        where: {
            id,
        },
    });
    if ((blogData === null || blogData === void 0 ? void 0 : blogData.authorId) !== user.userId && user.role !== prisma_2.userRole.admin) {
        throw new Error("You cannot update this blog");
    }
    const result = yield prisma_1.prisma.blog.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const removeImage = (id, image) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const blog = yield prisma_1.prisma.blog.findUnique({
        where: {
            id,
        },
        select: {
            images: true,
        },
    });
    const finalImages = (_a = blog === null || blog === void 0 ? void 0 : blog.images) === null || _a === void 0 ? void 0 : _a.filter((img) => img !== image);
    const result = yield prisma_1.prisma.blog.update({
        where: {
            id,
        },
        data: {
            images: finalImages,
        },
    });
    return result;
});
const deleteBlog = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const blogData = yield prisma_1.prisma.blog.findUnique({
        where: {
            id,
        },
    });
    if ((blogData === null || blogData === void 0 ? void 0 : blogData.authorId) !== user.userId && user.role !== prisma_2.userRole.admin) {
        throw new Error("You cannot delete this blog");
    }
    const result = yield prisma_1.prisma.blog.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.blogServices = {
    writeBlog,
    getAllBlogs,
    getBlog,
    editBlog,
    deleteBlog,
    getMyBlogs,
    removeImage,
};
