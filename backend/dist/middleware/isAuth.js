"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = __importDefault(require("../errors/AppError"));
const auth_1 = __importDefault(require("../config/auth"));
const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.default("Token was not provided.", 403);
    }
    const [, token] = authHeader.split(" ");
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, auth_1.default.secret);
        const { id, profile, tenantId } = decoded;
        req.user = {
            id,
            profile,
            tenantId
        };
    }
    catch (err) {
        throw new AppError_1.default("Invalid token.", 403);
    }
    return next();
};
exports.default = isAuth;
//# sourceMappingURL=isAuth.js.map