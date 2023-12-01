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
const sequelize_1 = require("sequelize");
const Message_1 = __importDefault(require("../../models/Message"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const logger_1 = require("../../utils/logger");
const sleepRandomTime_1 = require("../../utils/sleepRandomTime");
const Contact_1 = __importDefault(require("../../models/Contact"));
const SendMessagesSystemWbot = (wbot, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {
        fromMe: true,
        messageId: { [sequelize_1.Op.is]: null },
        status: "pending",
        [sequelize_1.Op.or]: [
            {
                scheduleDate: {
                    [sequelize_1.Op.lte]: new Date()
                }
            },
            {
                scheduleDate: { [sequelize_1.Op.is]: null }
            }
        ]
    };
    const messages = yield Message_1.default.findAll({
        where,
        include: [
            {
                model: Contact_1.default,
                as: "contact",
                where: {
                    tenantId,
                    number: {
                        [sequelize_1.Op.notIn]: ["", "null"]
                    }
                }
            },
            {
                model: Ticket_1.default,
                as: "ticket",
                where: {
                    tenantId,
                    [sequelize_1.Op.or]: {
                        status: { [sequelize_1.Op.ne]: "closed" },
                        isFarewellMessage: true
                    },
                    channel: "whatsapp",
                    whatsappId: wbot.id
                },
                include: ["contact"]
            },
            {
                model: Message_1.default,
                as: "quotedMsg",
                include: ["contact"]
            }
        ],
        order: [["createdAt", "ASC"]]
    });
    let sendedMessage;
    // logger.info(
    //   `SystemWbot SendMessages | Count: ${messages.length} | Tenant: ${tenantId} `
    // );
    for (const message of messages) {
        let quotedMsgSerializedId;
        const { ticket } = message;
        const contactNumber = ticket.contact.number;
        const typeGroup = (ticket === null || ticket === void 0 ? void 0 : ticket.isGroup) ? "g" : "c";
        const chatId = `${contactNumber}@${typeGroup}.us`;
        if (message.quotedMsg) {
            quotedMsgSerializedId = `${message.quotedMsg.fromMe}_${contactNumber}@${typeGroup}.us_${message.quotedMsg.messageId}`;
        }
        try {
            if (message.mediaType !== "chat" && message.mediaName) {
                const customPath = (0, path_1.join)(__dirname, "..", "..", "..", "public");
                const mediaPath = (0, path_1.join)(customPath, message.mediaName);
                const newMedia = whatsapp_web_js_1.MessageMedia.fromFilePath(mediaPath);
                sendedMessage = yield wbot.sendMessage(chatId, newMedia, {
                    quotedMessageId: quotedMsgSerializedId,
                    linkPreview: false,
                    sendAudioAsVoice: true
                });
                logger_1.logger.info("sendMessage media");
            }
            else {
                sendedMessage = yield wbot.sendMessage(chatId, message.body, {
                    quotedMessageId: quotedMsgSerializedId,
                    linkPreview: false // fix: send a message takes 2 seconds when there's a link on message body
                });
                logger_1.logger.info("sendMessage text");
            }
            // enviar old_id para substituir no front a mensagem corretamente
            const messageToUpdate = Object.assign(Object.assign(Object.assign({}, message), sendedMessage), { id: message.id, messageId: sendedMessage.id.id, status: "sended" });
            yield Message_1.default.update(Object.assign({}, messageToUpdate), { where: { id: message.id } });
            logger_1.logger.info("Message Update");
            // await SetTicketMessagesAsRead(ticket);
            // delay para processamento da mensagem
            yield (0, sleepRandomTime_1.sleepRandomTime)({
                minMilliseconds: Number(process.env.MIN_SLEEP_INTERVAL || 500),
                maxMilliseconds: Number(process.env.MAX_SLEEP_INTERVAL || 2000)
            });
            logger_1.logger.info("sendMessage", sendedMessage.id.id);
        }
        catch (error) {
            const idMessage = message.id;
            const ticketId = message.ticket.id;
            if (error.code === "ENOENT") {
                yield Message_1.default.destroy({
                    where: { id: message.id }
                });
            }
            logger_1.logger.error(`Error message is (tenant: ${tenantId} | Ticket: ${ticketId})`);
            logger_1.logger.error(`Error send message (id: ${idMessage})::${error}`);
        }
    }
});
exports.default = SendMessagesSystemWbot;
//# sourceMappingURL=SendMessagesSystemWbot.js.map