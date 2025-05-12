"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ideaValidationSchemas = exports.updateIdeaValidationSchema = exports.createIdeaValidationSchema = exports.ideaStatusEnum = void 0;
const zod_1 = require("zod");
exports.ideaStatusEnum = zod_1.z.enum(["pending", "approved", "rejected"]);
const categoryEnum = zod_1.z.enum(["energy", "waste", "transportation"]);
exports.createIdeaValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    category: categoryEnum,
    images: zod_1.z.array(zod_1.z.string()).optional(),
    authorId: zod_1.z.string().min(1),
    problem_statement: zod_1.z.string().min(1),
    proposed_solution: zod_1.z.string().min(1),
    isPremium: zod_1.z.boolean().optional(),
    price: zod_1.z.string().optional(),
    status: exports.ideaStatusEnum.optional(),
});
exports.updateIdeaValidationSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    category: categoryEnum.optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    authorId: zod_1.z.string().optional(),
    problem_statement: zod_1.z.string().optional(),
    proposed_solution: zod_1.z.string().optional(),
    isPremium: zod_1.z.boolean().optional(),
    price: zod_1.z.string().optional(),
    status: exports.ideaStatusEnum.optional(),
});
exports.ideaValidationSchemas = {
    createIdeaValidationSchema: exports.createIdeaValidationSchema,
    updateIdeaValidationSchema: exports.updateIdeaValidationSchema,
};
