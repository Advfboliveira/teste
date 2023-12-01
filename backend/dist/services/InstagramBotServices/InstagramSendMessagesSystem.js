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
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const promises_1 = require("fs/promises");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const path_1 = require("path");
const sequelize_1 = require("sequelize");
const sharp_1 = __importDefault(require("sharp"));
const SetTicketMessagesAsRead_1 = __importDefault(require("../../helpers/SetTicketMessagesAsRead"));
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const Message_1 = __importDefault(require("../../models/Message"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const logger_1 = require("../../utils/logger");
const sleepRandomTime_1 = require("../../utils/sleepRandomTime");
const SendMessagesSystemWbot = (instaBot, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
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
                    channel: "instagram",
                    whatsappId: instaBot.id
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
        const chatId = ticket.contact.instagramPK;
        const threadEntity = yield instaBot.entity.directThread([chatId]);
        // if (message.quotedMsg) {
        //   quotedMsgSerializedId = `${message.quotedMsg.fromMe}_${contactNumber}@${typeGroup}.us_${message.quotedMsg.messageId}`;
        // }
        try {
            if (!["chat", "text"].includes(message.mediaType) && message.mediaName) {
                const customPath = (0, path_1.join)(__dirname, "..", "..", "..", "public");
                const mediaPath = (0, path_1.join)(customPath, message.mediaName);
                const file = yield (0, promises_1.readFile)(mediaPath);
                console.log(mediaPath);
                if (message.mediaType === "audio" || message.mediaType === "ptt") {
                    const splitName = message.mediaName.split(".");
                    const newAudioPath = (0, path_1.join)(customPath, `${splitName[0]}.mp4`);
                    yield new Promise((resolve, reject) => {
                        (0, fluent_ffmpeg_1.default)(mediaPath)
                            .toFormat("mp4")
                            .on("error", error => reject(error))
                            .on("end", () => resolve(true))
                            .saveToFile(newAudioPath);
                    });
                    const voice = yield (0, promises_1.readFile)(newAudioPath);
                    sendedMessage = yield threadEntity.broadcastVoice({
                        file: voice
                    });
                }
                if (message.mediaType === "image") {
                    const photo = yield (0, sharp_1.default)(file).jpeg().toBuffer();
                    sendedMessage = yield threadEntity.broadcastPhoto({
                        file: photo
                    });
                }
                if (message.mediaType === "video") {
                    sendedMessage = yield threadEntity.broadcastVideo({
                        video: file
                    });
                }
                logger_1.logger.info("sendMessage media");
            }
            if (["chat", "text"].includes(message.mediaType) && !message.mediaName) {
                sendedMessage = yield threadEntity.broadcastText(message.body);
                logger_1.logger.info("sendMessage text");
            }
            // enviar old_id para substituir no front a mensagem corretamente
            const messageToUpdate = Object.assign(Object.assign(Object.assign({}, message), sendedMessage), { id: message.id, timestamp: message.timestamp, messageId: sendedMessage.item_id, status: "sended", ack: 2 });
            yield Message_1.default.update(Object.assign({}, messageToUpdate), { where: { id: message.id } });
            (0, socketEmit_1.default)({
                tenantId: ticket.tenantId,
                type: "chat:ack",
                payload: Object.assign(Object.assign({}, message.dataValues), { mediaUrl: message.mediaUrl, id: message.id, timestamp: message.timestamp, messageId: sendedMessage.item_id, status: "sended", ack: 2 })
            });
            logger_1.logger.info("Message Update ok");
            yield (0, SetTicketMessagesAsRead_1.default)(ticket);
            // delay para processamento da mensagem
            yield (0, sleepRandomTime_1.sleepRandomTime)({
                minMilliseconds: Number(2000),
                maxMilliseconds: Number(3000)
            });
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
//# sourceMappingURL=InstagramSendMessagesSystem.js.map