"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQueries = exports.prisma = void 0;
const prisma_1 = require("../../../generated/prisma");
exports.prisma = new prisma_1.PrismaClient();
exports.paginationQueries = ['sortBy', 'sortOrder', 'limit', 'page'];
