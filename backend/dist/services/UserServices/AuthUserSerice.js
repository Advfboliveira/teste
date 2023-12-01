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
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const CreateTokens_1 = require("../../helpers/CreateTokens");
const Queue_1 = __importDefault(require("../../models/Queue"));
const AuthUserService = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({
        where: { email },
        include: [{ model: Queue_1.default, as: "queues" }]
    });
    // attributes: [
    //   "id",
    //   "email",
    //   "name",
    //   "lastLogin",
    //   "profile",
    //   "tenantId",
    //   "configs",
    //   "isOnline"
    // ]
    if (!user) {
        throw new AppError_1.default("ERR_INVALID_CREDENTIALS", 401);
    }
    if (!(yield user.checkPassword(password))) {
        throw new AppError_1.default("ERR_INVALID_CREDENTIALS", 401);
    }
    const token = (0, CreateTokens_1.createAccessToken)(user);
    const refreshToken = (0, CreateTokens_1.createRefreshToken)(user);
    yield user.update({
        isOnline: true,
        status: "online",
        lastLogin: new Date()
    });
    // retornar listagem de usuarios online
    const usuariosOnline = yield User_1.default.findAll({
        where: { tenantId: user.tenantId, isOnline: true },
        attributes: ["id", "email", "status", "lastOnline", "name", "lastLogin"]
        // include: [{ model: Queue, as: "queues" }]
    });
    return {
        user,
        token,
        refreshToken,
        usuariosOnline
    };
});
exports.default = AuthUserService;
//# sourceMappingURL=AuthUserSerice.js.map