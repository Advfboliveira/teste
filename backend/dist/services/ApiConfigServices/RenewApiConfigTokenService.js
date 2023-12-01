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
// import AppError from "../../errors/AppError";
const jsonwebtoken_1 = require("jsonwebtoken");
const ApiConfig_1 = __importDefault(require("../../models/ApiConfig"));
const auth_1 = __importDefault(require("../../config/auth"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const RenewApiConfigTokenService = ({ apiId, sessionId, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const { secret } = auth_1.default;
    const api = yield ApiConfig_1.default.findByPk(apiId);
    if (!api) {
        throw new AppError_1.default("ERR_API_CONFIG_NOT_FOUND", 404);
    }
    const token = (0, jsonwebtoken_1.sign)({
        tenantId,
        profile: "admin",
        sessionId
    }, secret, {
        expiresIn: "730d"
    });
    api.update({ token });
    api.reload();
    return api;
});
exports.default = RenewApiConfigTokenService;
//# sourceMappingURL=RenewApiConfigTokenService.js.map