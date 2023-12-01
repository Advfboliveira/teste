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
const getQuotedForMessageId_1 = __importDefault(require("../../helpers/getQuotedForMessageId"));
const CreateMessageService_1 = __importDefault(require("../MessageServices/CreateMessageService"));
// import { logger } from "../../utils/logger";
const VerifyMessage = (ctx, fromMe, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const quotedMsg = await VerifyQuotedMessage(msg);
    // logger.error(err);
    let message;
    let updateMessage = {};
    message = ctx === null || ctx === void 0 ? void 0 : ctx.message;
    updateMessage = ctx === null || ctx === void 0 ? void 0 : ctx.update;
    // Verificar se mensagem foi editada.
    if (!message && updateMessage) {
        message = updateMessage === null || updateMessage === void 0 ? void 0 : updateMessage.edited_message;
    }
    let quotedMsgId;
    if ((_a = message === null || message === void 0 ? void 0 : message.reply_to_message) === null || _a === void 0 ? void 0 : _a.message_id) {
        const messageQuoted = yield (0, getQuotedForMessageId_1.default)(message.reply_to_message.message_id, ticket.tenantId);
        quotedMsgId = (messageQuoted === null || messageQuoted === void 0 ? void 0 : messageQuoted.id) || undefined;
    }
    const messageData = {
        messageId: String(message === null || message === void 0 ? void 0 : message.message_id),
        ticketId: ticket.id,
        contactId: fromMe ? undefined : contact.id,
        body: message.text,
        fromMe,
        read: fromMe,
        mediaType: "chat",
        quotedMsgId,
        timestamp: +message.date * 1000,
        status: "received"
    };
    yield ticket.update({
        lastMessage: message.text,
        lastMessageAt: new Date().getTime(),
        answered: fromMe || false
    });
    yield (0, CreateMessageService_1.default)({
        messageData,
        tenantId: ticket.tenantId
    });
});
exports.default = VerifyMessage;
//# sourceMappingURL=TelegramVerifyMessage.js.map