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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const FastReply_1 = __importDefault(require("../../models/FastReply"));
const UpdateFastReplyService = ({ fastReplyData, fastReplyId }) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, message, userId, tenantId } = fastReplyData;
    const fastReplyModel = yield FastReply_1.default.findOne({
        where: { id: fastReplyId, tenantId },
        attributes: ["id", "key", "message", "userId"]
    });
    if (!fastReplyModel) {
        throw new AppError_1.default("ERR_NO_FAST_REPLY_FOUND", 404);
    }
    yield fastReplyModel.update({
        key,
        message,
        userId
    });
    yield fastReplyModel.reload({
        attributes: ["id", "key", "message", "userId"]
    });
    return fastReplyModel;
});
exports.default = UpdateFastReplyService;
//# sourceMappingURL=UpdateFastReplyService.js.map