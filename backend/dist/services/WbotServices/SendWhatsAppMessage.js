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
const GetTicketWbot_1 = __importDefault(require("../../helpers/GetTicketWbot"));
const GetWbotMessage_1 = __importDefault(require("../../helpers/GetWbotMessage"));
const SerializeWbotMsgId_1 = __importDefault(require("../../helpers/SerializeWbotMsgId"));
const UserMessagesLog_1 = __importDefault(require("../../models/UserMessagesLog"));
const logger_1 = require("../../utils/logger");
const SendWhatsAppMessage = ({ body, ticket, quotedMsg, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    let quotedMsgSerializedId;
    if (quotedMsg) {
        yield (0, GetWbotMessage_1.default)(ticket, quotedMsg.id);
        quotedMsgSerializedId = (0, SerializeWbotMsgId_1.default)(ticket, quotedMsg);
    }
    const wbot = yield (0, GetTicketWbot_1.default)(ticket);
    try {
        const sendMessage = yield wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`, body, {
            quotedMessageId: quotedMsgSerializedId,
            linkPreview: false // fix: send a message takes 2 seconds when there's a link on message body
        });
        yield ticket.update({
            lastMessage: body,
            lastMessageAt: new Date().getTime()
        });
        try {
            if (userId) {
                yield UserMessagesLog_1.default.create({
                    messageId: sendMessage.id.id,
                    userId,
                    ticketId: ticket.id
                });
            }
        }
        catch (error) {
            logger_1.logger.error(`Error criar log mensagem ${error}`);
        }
        return sendMessage;
    }
    catch (err) {
        logger_1.logger.error(`SendWhatsAppMessage | Error: ${err}`);
        // await StartWhatsAppSessionVerify(ticket.whatsappId, err);
        throw new AppError_1.default("ERR_SENDING_WAPP_MSG");
    }
});
exports.default = SendWhatsAppMessage;
//# sourceMappingURL=SendWhatsAppMessage.js.map