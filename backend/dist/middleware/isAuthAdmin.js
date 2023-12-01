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
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = __importDefault(require("../errors/AppError"));
const auth_1 = __importDefault(require("../config/auth"));
const User_1 = __importDefault(require("../models/User"));
const isAuthAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const adminDomain = process.env.ADMIN_DOMAIN;
    if (!authHeader) {
        throw new AppError_1.default("Token was not provided.", 403);
    }
    if (!adminDomain) {
        throw new AppError_1.default("Not exists admin domains defined.", 403);
    }
    const [, token] = authHeader.split(" ");
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, auth_1.default.secret);
        const { id, profile, tenantId } = decoded;
        const user = yield User_1.default.findByPk(id);
        if (!user || user.email.indexOf(adminDomain) === 1) {
            throw new AppError_1.default("Not admin permission", 403);
        }
        req.user = {
            id,
            profile,
            tenantId
        };
    }
    catch (err) {
        throw new AppError_1.default("Invalid token or not Admin", 403);
    }
    return next();
});
exports.default = isAuthAdmin;
//# sourceMappingURL=isAuthAdmin.js.map