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
// import { promisify } from "util";
const path_1 = require("path");
const axios_1 = __importDefault(require("axios"));
const mime_1 = __importDefault(require("mime"));
const uuid_1 = require("uuid");
const logger_1 = require("../../utils/logger");
// import MessageOffLine from "../../models/MessageOffLine";
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const Message_1 = __importDefault(require("../../models/Message"));
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const Queue_1 = __importDefault(require("../../libs/Queue"));
const pupa_1 = require("../../utils/pupa");
// const writeFileAsync = promisify(writeFile);
const downloadMedia = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const request = yield axios_1.default.get(msg.mediaUrl, {
            responseType: "stream"
        });
        const cType = request.headers["content-type"];
        const tMine = mime_1.default;
        const fileExt = tMine.extension(cType);
        const mediaName = (0, uuid_1.v4)();
        const dir = (0, path_1.join)(__dirname, "..", "..", "..", "public");
        const fileName = `${mediaName}.${fileExt}`;
        const mediaPath = (0, path_1.join)(dir, fileName);
        const mediaData = {
            originalname: fileName,
            filename: fileName,
            mediaType: fileExt
        };
        yield new Promise((resolve, reject) => {
            request.data
                .pipe(fs_1.default.createWriteStream(mediaPath))
                .on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
                resolve(mediaData);
            }))
                .on("error", (error) => {
                console.error("ERROR DONWLOAD", error);
                fs_1.default.rmdirSync(mediaPath, { recursive: true });
                reject(new Error(error));
            });
        });
        return mediaData;
    }
    catch (error) {
        if (error.response.status === 404) {
            const payload = {
                ack: -1,
                body: msg.body,
                messageId: "",
                number: msg.number,
                externalKey: msg.externalKey,
                error: error.message,
                authToken: msg.apiConfig.authToken,
                type: "hookMessageStatus"
            };
            if ((_a = msg === null || msg === void 0 ? void 0 : msg.apiConfig) === null || _a === void 0 ? void 0 : _a.urlMessageStatus) {
                Queue_1.default.add("WebHooksAPI", {
                    url: msg.apiConfig.urlMessageStatus,
                    type: payload.type,
                    payload
                });
            }
            return {};
        }
        throw new Error(error);
    }
});
const CreateMessageSystemService = ({ msg, tenantId, medias, ticket, userId, scheduleDate, sendType, status, idFront }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const messageData = {
        ticketId: ticket.id,
        body: msg.body,
        contactId: ticket.contactId,
        fromMe: sendType === "API" ? true : msg === null || msg === void 0 ? void 0 : msg.fromMe,
        read: true,
        mediaType: "chat",
        mediaUrl: undefined,
        timestamp: new Date().getTime(),
        quotedMsgId: (_b = msg === null || msg === void 0 ? void 0 : msg.quotedMsg) === null || _b === void 0 ? void 0 : _b.id,
        userId,
        scheduleDate,
        sendType,
        status,
        tenantId,
        idFront
    };
    try {
        // Alter template message
        messageData.body = (0, pupa_1.pupa)(msg.body || "", {
            // greeting: será considerado conforme data/hora da mensagem internamente na função pupa
            protocol: ticket.protocol,
            name: ticket.contact.name
        });
        if (sendType === "API" && msg.mediaUrl) {
            medias = [];
            const mediaData = yield downloadMedia(msg);
            medias.push(mediaData);
        }
        if (sendType === "API" && !msg.mediaUrl && msg.media) {
            medias = [];
            medias.push(msg.media);
        }
        if (medias) {
            yield Promise.all(medias.map((media) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (!media.filename) {
                        const ext = media.mimetype.split("/")[1].split(";")[0];
                        media.filename = `${new Date().getTime()}.${ext}`;
                    }
                }
                catch (err) {
                    logger_1.logger.error(err);
                }
                const message = Object.assign(Object.assign({}, messageData), { body: media.originalname, mediaUrl: media.filename, mediaType: media.mediaType ||
                        media.mimetype.substr(0, media.mimetype.indexOf("/")) });
                const msgCreated = yield Message_1.default.create(message);
                const messageCreated = yield Message_1.default.findByPk(msgCreated.id, {
                    include: [
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
                    ]
                });
                if (!messageCreated) {
                    throw new Error("ERR_CREATING_MESSAGE_SYSTEM");
                }
                yield ticket.update({
                    lastMessage: messageCreated.body,
                    lastMessageAt: new Date().getTime()
                });
                // Avaliar utilização do rabbitmq
                // if (!scheduleDate) {
                //   global.rabbitWhatsapp.publishInQueue(
                //     `whatsapp::${tenantId}`,
                //     JSON.stringify({
                //       ...messageCreated.toJSON(),
                //       contact: ticket.contact.toJSON()
                //     })
                //   );
                // }
                (0, socketEmit_1.default)({
                    tenantId,
                    type: "chat:create",
                    payload: messageCreated
                });
            })));
        }
        else {
            const msgCreated = yield Message_1.default.create(Object.assign(Object.assign({}, messageData), { mediaType: "chat" }));
            const messageCreated = yield Message_1.default.findByPk(msgCreated.id, {
                include: [
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
                ]
            });
            if (!messageCreated) {
                // throw new AppError("ERR_CREATING_MESSAGE", 501);
                throw new Error("ERR_CREATING_MESSAGE_SYSTEM");
            }
            yield ticket.update({
                lastMessage: messageCreated.body,
                lastMessageAt: new Date().getTime(),
                answered: true
            });
            // Avaliar utilização do rabbitmq
            // if (!scheduleDate) {
            //   global.rabbitWhatsapp.publishInQueue(
            //     `whatsapp::${tenantId}`,
            //     JSON.stringify({
            //       ...messageCreated.toJSON(),
            //       contact: ticket.contact.toJSON()
            //     })
            //   );
            // }
            (0, socketEmit_1.default)({
                tenantId,
                type: "chat:create",
                payload: messageCreated
            });
        }
    }
    catch (error) {
        logger_1.logger.error("CreateMessageSystemService", error);
    }
});
exports.default = CreateMessageSystemService;
//# sourceMappingURL=CreateMessageSystemService.js.map