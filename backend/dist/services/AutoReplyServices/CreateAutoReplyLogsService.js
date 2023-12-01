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
const AutoReplyLogs_1 = __importDefault(require("../../models/AutoReplyLogs"));
const CreateAutoReplyLogService = (stepsReply, ticket, msg) => __awaiter(void 0, void 0, void 0, function* () {
    const log = {
        autoReplyId: stepsReply.idAutoReply,
        autoReplyName: stepsReply.autoReply.name,
        stepsReplyId: stepsReply.id,
        stepsReplyMessage: stepsReply.reply,
        wordsReply: msg,
        ticketId: ticket.id,
        contactId: ticket.contactId
    };
    const autoReplyLog = yield AutoReplyLogs_1.default.create(log);
    return autoReplyLog;
});
exports.default = CreateAutoReplyLogService;
//# sourceMappingURL=CreateAutoReplyLogsService.js.map