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
const CreateMessageService_1 = __importDefault(require("../../MessageServices/CreateMessageService"));
const VerifyQuotedMessage_1 = __importDefault(require("./VerifyQuotedMessage"));
const VerifyMessage = (msg, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    const quotedMsg = yield (0, VerifyQuotedMessage_1.default)(msg);
    const messageData = {
        messageId: msg.id.id,
        ticketId: ticket.id,
        contactId: msg.fromMe ? undefined : contact.id,
        body: msg.body,
        fromMe: msg.fromMe,
        mediaType: msg.type,
        read: msg.fromMe,
        quotedMsgId: quotedMsg === null || quotedMsg === void 0 ? void 0 : quotedMsg.id,
        timestamp: msg.timestamp,
        status: "received"
    };
    yield ticket.update({
        lastMessage: msg.body,
        lastMessageAt: new Date().getTime(),
        answered: msg.fromMe || false
    });
    yield (0, CreateMessageService_1.default)({ messageData, tenantId: ticket.tenantId });
});
exports.default = VerifyMessage;
//# sourceMappingURL=VerifyMessage.js.map