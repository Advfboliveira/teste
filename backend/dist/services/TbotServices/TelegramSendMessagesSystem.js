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
const sequelize_1 = require("sequelize");
const SetTicketMessagesAsRead_1 = __importDefault(require("../../helpers/SetTicketMessagesAsRead"));
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const Message_1 = __importDefault(require("../../models/Message"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const logger_1 = require("../../utils/logger");
const SendMessagesSystemWbot = (tbot, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
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
            "contact",
            {
                model: Ticket_1.default,
                as: "ticket",
                where: {
                    tenantId,
                    [sequelize_1.Op.or]: {
                        status: { [sequelize_1.Op.ne]: "closed" },
                        isFarewellMessage: true
                    },
                    channel: "telegram",
                    whatsappId: tbot.id
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
    for (const messageItem of messages) {
        const message = messageItem;
        // let quotedMsgSerializedId: string | undefined;
        const { ticket } = message;
        const chatId = ticket.contact.telegramId;
        const extraInfo = {};
        if (message.quotedMsg) {
            extraInfo.reply_to_message_id = message.quotedMsg.messageId;
        }
        try {
            if (!["chat", "text"].includes(message.mediaType) && message.mediaName) {
                const customPath = (0, path_1.join)(__dirname, "..", "..", "..", "public");
                const mediaPath = (0, path_1.join)(customPath, message.mediaName);
                if (message.mediaType === "audio" || message.mediaType === "ptt") {
                    sendedMessage = yield tbot.telegram.sendVoice(chatId, {
                        source: mediaPath
                    }, extraInfo);
                }
                else if (message.mediaType === "image") {
                    sendedMessage = yield tbot.telegram.sendPhoto(chatId, {
                        source: mediaPath
                    }, extraInfo);
                }
                else if (message.mediaType === "video") {
                    sendedMessage = yield tbot.telegram.sendVideo(chatId, {
                        source: mediaPath
                    }, extraInfo);
                }
                else {
                    sendedMessage = yield tbot.telegram.sendDocument(chatId, {
                        source: mediaPath
                    }, extraInfo);
                }
                logger_1.logger.info("sendMessage media");
            }
            else {
                sendedMessage = yield tbot.telegram.sendMessage(chatId, message.body, extraInfo);
                logger_1.logger.info("sendMessage text");
            }
            // enviar old_id para substituir no front a mensagem corretamente
            const messageToUpdate = Object.assign(Object.assign(Object.assign({}, message), sendedMessage), { id: message.id, timestamp: sendedMessage.date * 1000, messageId: sendedMessage.message_id, status: "sended", ack: 2 });
            yield Message_1.default.update(Object.assign({}, messageToUpdate), { where: { id: message.id } });
            (0, socketEmit_1.default)({
                tenantId: ticket.tenantId,
                type: "chat:ack",
                payload: Object.assign(Object.assign({}, message.dataValues), { id: message.id, mediaUrl: message.mediaUrl, timestamp: messageToUpdate.timestamp, messageId: sendedMessage.message_id, status: "sended", ack: 2 })
            });
            logger_1.logger.info("Message Update ok");
            yield (0, SetTicketMessagesAsRead_1.default)(ticket);
            // delay para processamento da mensagem
            // await sleepRandomTime({
            //   minMilliseconds: Number(process.env.MIN_SLEEP_INTERVAL || 2000),
            //   maxMilliseconds: Number(process.env.MAX_SLEEP_INTERVAL || 5000)
            // });
            // logger.info("sendMessage", sendedMessage.id.id);
        }
        catch (error) {
            const idMessage = message.id;
            const ticketId = message.ticket.id;
            logger_1.logger.error(`Error message is (tenant: ${tenantId} | Ticket: ${ticketId})`);
            logger_1.logger.error(`Error send message (id: ${idMessage}):: ${error}`);
        }
    }
});
exports.default = SendMessagesSystemWbot;
//# sourceMappingURL=TelegramSendMessagesSystem.js.map