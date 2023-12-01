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
exports.logout = exports.update = exports.store = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const AuthUserSerice_1 = __importDefault(require("../services/UserServices/AuthUserSerice"));
const SendRefreshToken_1 = require("../helpers/SendRefreshToken");
const RefreshTokenService_1 = require("../services/AuthServices/RefreshTokenService");
const socket_1 = require("../libs/socket");
const User_1 = __importDefault(require("../models/User"));
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const io = (0, socket_1.getIO)();
    const { email, password } = req.body;
    const { token, user, refreshToken, usuariosOnline } = yield (0, AuthUserSerice_1.default)({
        email,
        password
    });
    (0, SendRefreshToken_1.SendRefreshToken)(res, refreshToken);
    const params = {
        token,
        username: user.name,
        email: user.email,
        profile: user.profile,
        status: user.status,
        userId: user.id,
        tenantId: user.tenantId,
        queues: user.queues,
        usuariosOnline,
        configs: user.configs
    };
    io.emit(`${params.tenantId}:users`, {
        action: "update",
        data: {
            username: params.username,
            email: params.email,
            isOnline: true,
            lastLogin: new Date()
        }
    });
    return res.status(200).json(params);
});
exports.store = store;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jrt;
    if (!token) {
        throw new AppError_1.default("ERR_SESSION_EXPIRED", 401);
    }
    const { newToken, refreshToken } = yield (0, RefreshTokenService_1.RefreshTokenService)(token);
    (0, SendRefreshToken_1.SendRefreshToken)(res, refreshToken);
    return res.json({ token: newToken });
});
exports.update = update;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        throw new AppError_1.default("ERR_USER_NOT_FOUND", 404);
    }
    const io = (0, socket_1.getIO)();
    const userLogout = yield User_1.default.findByPk(userId);
    if (userLogout) {
        userLogout.update({ isOnline: false, lastLogout: new Date() });
    }
    io.emit(`${userLogout === null || userLogout === void 0 ? void 0 : userLogout.tenantId}:users`, {
        action: "update",
        data: {
            username: userLogout === null || userLogout === void 0 ? void 0 : userLogout.name,
            email: userLogout === null || userLogout === void 0 ? void 0 : userLogout.email,
            isOnline: false,
            lastLogout: new Date()
        }
    });
    // SendRefreshToken(res, refreshToken);
    return res.json({ message: "USER_LOGOUT" });
});
exports.logout = logout;
//# sourceMappingURL=SessionController.js.map