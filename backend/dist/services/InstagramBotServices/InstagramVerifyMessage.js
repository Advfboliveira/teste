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
const CreateMessageService_1 = __importDefault(require("../MessageServices/CreateMessageService"));
// import { logger } from "../../utils/logger";
const VerifyMessage = (ctx, fromMe, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    // const quotedMsg = await VerifyQuotedMessage(msg);
    // logger.error(err);
    const messageData = {
        messageId: String(ctx.message.item_id),
        ticketId: ticket.id,
        contactId: fromMe ? undefined : contact.id,
        body: ctx.message.text,
        fromMe,
        read: fromMe,
        mediaType: "chat",
        quotedMsgId: "",
        timestamp: new Date().getTime(),
        status: "received"
    };
    yield ticket.update({
        lastMessage: ctx.message.text,
        lastMessageAt: new Date().getTime(),
        answered: fromMe || false
    });
    yield (0, CreateMessageService_1.default)({
        messageData,
        tenantId: ticket.tenantId
    });
});
exports.default = VerifyMessage;
//# sourceMappingURL=InstagramVerifyMessage.js.map