"use strict";
// import * as Yup from "yup";
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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const User_1 = __importDefault(require("../../models/User"));
const UpdateUserConfigsService = ({ userConfigs, userId, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({
        where: { id: userId, tenantId },
        attributes: ["name", "id", "email", "profile", "configs"]
    });
    if (!user) {
        throw new AppError_1.default("ERR_NO_USER_FOUND", 404);
    }
    yield user.update({
        configs: Object.assign(Object.assign({}, user.configs), userConfigs)
    });
});
exports.default = UpdateUserConfigsService;
//# sourceMappingURL=UpdateUserConfigsService.js.map