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
const sequelize_1 = require("sequelize");
const SetTicketMessagesAsRead_1 = __importDefault(require("../../helpers/SetTicketMessagesAsRead"));
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const Message_1 = __importDefault(require("../../models/Message"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const logger_1 = require("../../utils/logger");
const SentMessage_1 = __importDefault(require("./SentMessage"));
const buildWabaMessage360 = (message, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    let newMessage = {
        timestamp: String(message.timestamp),
        recipient_type: "individual",
        to: chatId,
        type: "text"
    };
    if (message.mediaType === "application" || message.mediaType === "document") {
        newMessage = Object.assign(Object.assign({}, newMessage), { type: "document", document: {
                id: message.wabaMediaId,
                caption: message.body || message.mediaName || "" || ""
            } });
    }
    if (message.mediaType === "image") {
        newMessage = Object.assign(Object.assign({}, newMessage), { type: "image", image: {
                id: message.wabaMediaId,
                caption: message.body || message.mediaName || ""
            } });
    }
    if (message.mediaType === "video") {
        newMessage = Object.assign(Object.assign({}, newMessage), { type: "video", video: {
                id: message.wabaMediaId,
                caption: message.body || message.mediaName || ""
            } });
    }
    if (message.mediaType === "audio" || message.mediaType === "voice") {
        newMessage = Object.assign(Object.assign({}, newMessage), { type: "audio", audio: {
                id: message.wabaMediaId,
                caption: message.body || message.mediaName || ""
            } });
    }
    if (message.mediaType === "chat" || message.mediaType === "text") {
        newMessage = Object.assign(Object.assign({}, newMessage), { text: {
                body: message.body
            } });
    }
    return newMessage;
});
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
const Waba360SendMessagesSystem = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield Message_1.default.findAll({
        where,
        include: [
            "contact",
            {
                model: Ticket_1.default,
                as: "ticket",
                where: { tenantId: connection.tenantId, channel: "waba" },
                include: [
                    "contact",
                    {
                        model: Whatsapp_1.default,
                        as: "whatsapp",
                        where: { id: connection.id, type: "waba", wabaBSP: "360" }
                    }
                ]
            },
            {
                model: Message_1.default,
                as: "quotedMsg",
                include: ["contact"]
            }
        ],
        order: [["createdAt", "ASC"]]
    });
    for (const messageItem of messages) {
        const { ticket } = messageItem;
        const chatId = String(ticket.contact.number);
        // verificar se já foi feito upload do arquivo
        if (!["text", "chat"].includes(messageItem.mediaType) &&
            messageItem.mediaUrl &&
            !messageItem.wabaMediaId) {
            // adicionar à fila o upload do arquivo antes de seguir
            // return;
        }
        const buldedMessage = yield buildWabaMessage360(messageItem, chatId);
        const sendedMessage = yield (0, SentMessage_1.default)({
            message: buldedMessage,
            apiKey: connection.tokenAPI
        });
        const messageToUpdate = Object.assign(Object.assign({}, messageItem), { messageId: sendedMessage.messages[0].id, status: "sended", ack: 2 });
        yield Message_1.default.update(Object.assign({}, messageToUpdate), { where: { id: messageItem.id } });
        (0, socketEmit_1.default)({
            tenantId: ticket.tenantId,
            type: "chat:ack",
            payload: Object.assign(Object.assign({}, messageToUpdate.dataValues), { mediaUrl: messageItem.mediaUrl, messageId: messageToUpdate.messageId, status: "sended", ack: 2 })
        });
        logger_1.logger.info("Message Update ok");
        yield (0, SetTicketMessagesAsRead_1.default)(ticket);
    }
});
exports.default = Waba360SendMessagesSystem;
//# sourceMappingURL=Waba360SendMessagesSystem.js.map