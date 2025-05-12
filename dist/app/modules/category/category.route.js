"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/create-category", (0, auth_1.default)("admin"), (0, validateRequest_1.default)(category_validation_1.categoryValidationSchemas.createCategoryValidationSchema), category_controller_1.categoryControllers.createCategory);
router.get("/get-all-categories", category_controller_1.categoryControllers.getAllCategories);
exports.categoryRouter = router;
