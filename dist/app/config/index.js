"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), ".env")) });
exports.default = {
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires_in: process.env.JWT_EXPAIRS_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPAIRS_IN,
    email: process.env.EMAIL,
    app_password: process.env.APP_PASSWORD,
    reset_password_secret: process.env.RESET_PASS_SECRET,
    reset_password_expires_in: process.env.RESET_PASS_EXPAIRS_IN,
    reset_password_link: process.env.RESET_PASS_LINK,
};
