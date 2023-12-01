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
/* eslint-disable no-restricted-syntax */
const util_1 = require("util");
const fs_1 = require("fs");
const ChatFlow_1 = __importDefault(require("../../models/ChatFlow"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const writeFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const DeleteChatFlowService = ({ id, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const cahtFlow = yield ChatFlow_1.default.findOne({
        where: { id, tenantId }
    });
    if (!cahtFlow) {
        throw new AppError_1.default("ERR_NO_CHAT_FLOW_FOUND", 404);
    }
    yield cahtFlow.update({
        isActive: false,
        isDeleted: true
    });
    yield cahtFlow.reload({
        attributes: ["isActive", "isDeleted"]
    });
});
exports.default = DeleteChatFlowService;
//# sourceMappingURL=DeleteChatFlowService.js.map