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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ideaControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const idea_service_1 = require("./idea.service");
const pick_1 = __importDefault(require("../../utils/pick"));
const idea_constant_1 = require("./idea.constant");
const prisma_1 = require("../../utils/prisma");
const createIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const result = yield idea_service_1.ideaServices.createIdea(req.body, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Idea Created Successfully",
        data: result,
    });
}));
const getAllIdeas = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ideaFilters = (0, pick_1.default)(req.query, idea_constant_1.ideaFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, prisma_1.paginationQueries);
    const result = yield idea_service_1.ideaServices.getAllIdeas(ideaFilters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Ideas Retrieved Successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield idea_service_1.ideaServices.getSingleIdea(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Idea is Retrieved Successfully",
        data: result,
    });
}));
const getMyIdeas = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const result = yield idea_service_1.ideaServices.getMyIdeas(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Ideas Retrieved Successfully",
        data: result,
    });
}));
const updateIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { id } = req.params;
    const result = yield idea_service_1.ideaServices.updateIdea(user, id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Idea updated Successfully",
        data: result,
    });
}));
const deleteIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { id } = req.params;
    const result = yield idea_service_1.ideaServices.deleteIdea(user, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Idea deleted Successfully",
        data: result,
    });
}));
exports.ideaControllers = {
    createIdea,
    getAllIdeas,
    getSingleIdea,
    getMyIdeas,
    updateIdea,
    deleteIdea,
};
