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
const AutoReply_1 = __importDefault(require("../../models/AutoReply"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const DeleteAutoReplyService = ({ id, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const autoReply = yield AutoReply_1.default.findOne({
        where: { id, tenantId }
    });
    const countTicket = yield Ticket_1.default.findOne({ where: { autoReplyId: id } });
    if (countTicket) {
        throw new AppError_1.default("ERR_AUTO_REPLY_RELATIONED_TICKET", 404);
    }
    if (!autoReply) {
        throw new AppError_1.default("ERR_NO_AUTO_REPLY_FOUND", 404);
    }
    yield autoReply.destroy();
});
exports.default = DeleteAutoReplyService;
//# sourceMappingURL=DeleteAutoReplyService.js.map