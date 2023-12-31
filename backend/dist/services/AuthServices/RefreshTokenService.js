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
exports.RefreshTokenService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const ShowUserService_1 = __importDefault(require("../UserServices/ShowUserService"));
const auth_1 = __importDefault(require("../../config/auth"));
const CreateTokens_1 = require("../../helpers/CreateTokens");
const RefreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    try {
        decoded = (0, jsonwebtoken_1.verify)(token, auth_1.default.refreshSecret);
    }
    catch (err) {
        throw new AppError_1.default("ERR_SESSION_EXPIRED", 401);
    }
    const { id, tokenVersion } = decoded;
    const user = yield (0, ShowUserService_1.default)(id, 1);
    if (user.tokenVersion !== tokenVersion) {
        throw new AppError_1.default("ERR_SESSION_EXPIRED", 401);
    }
    const newToken = (0, CreateTokens_1.createAccessToken)(user);
    const refreshToken = (0, CreateTokens_1.createRefreshToken)(user);
    return { newToken, refreshToken };
});
exports.RefreshTokenService = RefreshTokenService;
//# sourceMappingURL=RefreshTokenService.js.map