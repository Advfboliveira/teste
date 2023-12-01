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
const path_1 = require("path");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const Message_1 = __importDefault(require("../../models/Message"));
const MessageOffLine_1 = __importDefault(require("../../models/MessageOffLine"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const logger_1 = require("../../utils/logger");
const SendWhatsAppMessage_1 = __importDefault(require("./SendWhatsAppMessage"));
const socket_1 = require("../../libs/socket");
const UserMessagesLog_1 = __importDefault(require("../../models/UserMessagesLog"));
const SendOffLineMessagesWbot = (wbot, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield MessageOffLine_1.default.findAll({
        include: [
            "contact",
            {
                model: Ticket_1.default,
                as: "ticket",
                where: { tenantId },
                include: ["contact"]
            },
            {
                model: Message_1.default,
                as: "quotedMsg",
                include: ["contact"]
            }
        ],
        order: [["updatedAt", "ASC"]]
    });
    const io = (0, socket_1.getIO)();
    yield Promise.all(messages.map((message) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.info(`Send Message OffLine: ${message}`);
        try {
            if (message.mediaType !== "chat" && message.mediaName) {
                const customPath = (0, path_1.join)(__dirname, "..", "..", "..", "public");
                const mediaPath = (0, path_1.join)(process.env.PATH_OFFLINE_MEDIA || customPath, message.mediaName);
                const newMedia = whatsapp_web_js_1.MessageMedia.fromFilePath(mediaPath);
                const { number } = message.ticket.contact;
                const sendMessage = yield wbot.sendMessage(`${number}@${message.ticket.isGroup ? "g" : "c"}.us`, newMedia, { sendAudioAsVoice: true });
                try {
                    if (message.userId) {
                        yield UserMessagesLog_1.default.create({
                            messageId: sendMessage.id.id,
                            userId: message.userId,
                            ticketId: message.ticketId
                        });
                    }
                }
                catch (error) {
                    logger_1.logger.error(`Error criar log mensagem ${error}`);
                }
            }
            else {
                yield (0, SendWhatsAppMessage_1.default)({
                    body: message.body,
                    ticket: message.ticket,
                    quotedMsg: message.quotedMsg,
                    userId: message.userId
                });
            }
            yield MessageOffLine_1.default.destroy({ where: { id: message.id } });
            io.to(`${tenantId}-${message.ticketId.toString()}`).emit(`${tenantId}-appMessage`, {
                action: "delete",
                message
            });
        }
        catch (error) {
            logger_1.logger.error(`Error enviar messageOffLine: ${error}`);
        }
    })));
});
exports.default = SendOffLineMessagesWbot;
//# sourceMappingURL=SendOffLineMessagesWbot.js.map