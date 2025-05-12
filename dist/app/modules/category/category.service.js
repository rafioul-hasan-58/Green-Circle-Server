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
exports.categoryServices = void 0;
const prisma_1 = require("../../utils/prisma");
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExist = yield prisma_1.prisma.category.findFirst({
        where: {
            name: payload.name,
        },
    });
    if (isCategoryExist) {
        throw new Error("Category already exists");
    }
    const result = yield prisma_1.prisma.category.create({
        data: {
            name: payload.name,
        },
    });
    return result;
});
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.category.findMany();
    return result;
});
exports.categoryServices = {
    createCategory,
    getAllCategories
};
