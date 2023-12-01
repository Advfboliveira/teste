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
const DeleteFastReplyService = ({ id, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const reply = yield FastReply_1.default.findOne({
        where: { id, tenantId }
    });
    if (!reply) {
        throw new AppError_1.default("ERR_NO_FAST_REPLY_FOUND", 404);
    }
    try {
        yield reply.destroy();
    }
    catch (error) {
        throw new AppError_1.default("ERR_FAST_REPLY_EXISTS", 404);
    }
});
exports.default = DeleteFastReplyService;
//# sourceMappingURL=DeleteFastReplyService.js.map