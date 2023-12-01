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
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const path_1 = require("path");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const Message_1 = __importDefault(require("../../models/Message"));
const logger_1 = require("../../utils/logger");
// import { sleepRandomTime } from "../../utils/sleepRandomTime";
const wbot_1 = require("../../libs/wbot");
// import SetTicketMessagesAsRead from "../../helpers/SetTicketMessagesAsRead";
const SendMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info(`SendMessage: ${message.id}`);
    const wbot = (0, wbot_1.getWbot)(message.ticket.whatsappId);
    let sendedMessage;
    // logger.info(
    //   `SystemWbot SendMessages | Count: ${messages.length} | Tenant: ${tenantId} `
    // );
    let quotedMsgSerializedId;
    const { ticket } = message;
    const contactNumber = message.contact.number;
    const typeGroup = (ticket === null || ticket === void 0 ? void 0 : ticket.isGroup) ? "g" : "c";
    const chatId = `${contactNumber}@${typeGroup}.us`;
    if (message.quotedMsg) {
        quotedMsgSerializedId = `${message.quotedMsg.fromMe}_${contactNumber}@${typeGroup}.us_${message.quotedMsg.messageId}`;
    }
    if (message.mediaType !== "chat" && message.mediaName) {
        const customPath = (0, path_1.join)(__dirname, "..", "..", "..", "public");
        const mediaPath = (0, path_1.join)(customPath, message.mediaName);
        const newMedia = whatsapp_web_js_1.MessageMedia.fromFilePath(mediaPath);
        sendedMessage = yield wbot.sendMessage(chatId, newMedia, {
            quotedMessageId: quotedMsgSerializedId,
            linkPreview: false,
            sendAudioAsVoice: true
        });
    }
    else {
        sendedMessage = yield wbot.sendMessage(chatId, message.body, {
            quotedMessageId: quotedMsgSerializedId,
            linkPreview: false // fix: send a message takes 2 seconds when there's a link on message body
        });
    }
    // enviar old_id para substituir no front a mensagem corretamente
    const messageToUpdate = Object.assign(Object.assign(Object.assign({}, message), sendedMessage), { id: message.id, messageId: sendedMessage.id.id, status: "sended" });
    yield Message_1.default.update(Object.assign({}, messageToUpdate), { where: { id: message.id } });
    logger_1.logger.info("rabbit::Message Update");
    // await SetTicketMessagesAsRead(ticket);
    logger_1.logger.info("rabbit::sendedMessage", sendedMessage.id.id);
    // throw new Error("SIMULANDO ERRO");
});
const WhatsappConsumer = tenantId => {
    const queue = `whatsapp::${tenantId}`;
    global.rabbitWhatsapp.consumeWhatsapp(queue, (message) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.info(`SendMessage Queue: ${queue}`);
        const content = JSON.parse(message.content.toString());
        yield SendMessage(content);
    }));
};
exports.default = WhatsappConsumer;
//# sourceMappingURL=WhatsappConsumer.js.map