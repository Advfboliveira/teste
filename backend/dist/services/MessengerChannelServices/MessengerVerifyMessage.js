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
const MessengerVerifyMessage = (msg, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // const quotedMsg = await VerifyQuotedMessage(msg);
    let quotedMsgId;
    if ((_b = (_a = msg === null || msg === void 0 ? void 0 : msg.message) === null || _a === void 0 ? void 0 : _a.reply_to) === null || _b === void 0 ? void 0 : _b.mid) {
        const messageQuoted = yield (0, getQuotedForMessageId_1.default)(msg.message.reply_to.mid, ticket.tenantId);
        quotedMsgId = (messageQuoted === null || messageQuoted === void 0 ? void 0 : messageQuoted.id) || undefined;
    }
    const messageData = {
        messageId: msg.message_id || "",
        ticketId: ticket.id,
        contactId: contact.id,
        body: msg.message.text || "",
        fromMe: false,
        mediaType: msg.type,
        read: false,
        quotedMsgId,
        timestamp: msg.timestamp,
        status: "received"
    };
    yield ticket.update({
        lastMessage: messageData.body,
        lastMessageAt: new Date().getTime(),
        answered: false
    });
    yield (0, CreateMessageService_1.default)({ messageData, tenantId: ticket.tenantId });
});
exports.default = MessengerVerifyMessage;
//# sourceMappingURL=MessengerVerifyMessage.js.map