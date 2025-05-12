"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidationSchema = exports.createUserValidationSchema = exports.userRoleEnum = void 0;
const zod_1 = require("zod");
exports.userRoleEnum = zod_1.z.enum(["admin", "member"]);
exports.createUserValidationSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }),
    email: zod_1.z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
        .email("Invalid email address"),
    password: zod_1.z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }),
    image: zod_1.z.string({
        required_error: "Image is required",
        invalid_type_error: "Image must be a string",
    }),
});
exports.updateUserValidationSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
});
