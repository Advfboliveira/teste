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
const fs_1 = __importDefault(require("fs"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const GetTicketWbot_1 = __importDefault(require("../../helpers/GetTicketWbot"));
const UserMessagesLog_1 = __importDefault(require("../../models/UserMessagesLog"));
const logger_1 = require("../../utils/logger");
const SendWhatsAppMedia = ({ media, ticket, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wbot = yield (0, GetTicketWbot_1.default)(ticket);
        const newMedia = whatsapp_web_js_1.MessageMedia.fromFilePath(media.path);
        const sendMessage = yield wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`, newMedia, { sendAudioAsVoice: true });
        yield ticket.update({
            lastMessage: media.filename,
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
        fs_1.default.unlinkSync(media.path);
        return sendMessage;
    }
    catch (err) {
        logger_1.logger.error(`SendWhatsAppMedia | Error: ${err}`);
        // StartWhatsAppSessionVerify(ticket.whatsappId, err);
        throw new AppError_1.default("ERR_SENDING_WAPP_MSG");
    }
});
exports.default = SendWhatsAppMedia;
//# sourceMappingURL=SendWhatsAppMedia.js.map