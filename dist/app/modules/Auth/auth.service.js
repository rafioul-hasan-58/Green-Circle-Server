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
exports.AuthServices = void 0;
const config_1 = __importDefault(require("../../config"));
const jwt_helpers_1 = require("../../utils/jwt.helpers");
const prisma_1 = require("../../utils/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = __importDefault(require("./sendEmail"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Password doesn't match");
    }
    const accessToken = jwt_helpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        userId: userData.id,
    }, config_1.default.jwt_secret, config_1.default.jwt_expires_in || "1d");
    const refreshToken = jwt_helpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        userId: userData.id,
    }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in || "1d");
    return {
        accessToken,
        refreshToken,
        needsPasswordChange: userData.needsPasswordChange,
        role: userData.role,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
    if (typeof decodedData === "string" || !("email" in decodedData)) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Invalid token payload");
    }
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
        },
    });
    const accessToken = jwt_helpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        userId: userData.id,
    }, config_1.default.jwt_secret, config_1.default.jwt_expires_in);
    return { accessToken };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Password incorrect!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield prisma_1.prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            needsPasswordChange: false,
        },
    });
    return {
        message: "Password changed successfully!",
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
    });
    const resetPassToken = jwt_helpers_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role, userId: userData.id }, config_1.default.reset_password_secret, config_1.default.reset_password_expires_in);
    const resetPassLink = config_1.default.reset_password_link +
        `?userId=${userData.id}&token=${resetPassToken}`;
    yield (0, sendEmail_1.default)(userData.email, `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `);
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
        },
    });
    const isValidToken = jsonwebtoken_1.default.verify(token, config_1.default.reset_password_secret);
    if (!isValidToken) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
    }
    // hash password
    const password = yield bcrypt_1.default.hash(payload.password, 12);
    // update into database
    yield prisma_1.prisma.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password,
        },
    });
});
exports.AuthServices = {
    login,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
