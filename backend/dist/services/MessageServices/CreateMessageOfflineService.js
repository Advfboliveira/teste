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
const fs_1 = require("fs");
const util_1 = require("util");
const path_1 = require("path");
const logger_1 = require("../../utils/logger");
const MessageOffLine_1 = __importDefault(require("../../models/MessageOffLine"));
const socket_1 = require("../../libs/socket");
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const Message_1 = __importDefault(require("../../models/Message"));
const writeFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const CreateMessageOffilineService = ({ msg, tenantId, medias, ticket, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    const io = (0, socket_1.getIO)();
    const messageData = {
        wId: undefined,
        ticketId: ticket.id,
        body: msg.body,
        contactId: ticket.contactId,
        fromMe: msg.fromMe,
        read: true,
        mediaType: "chat",
        mediaUrl: undefined,
        timestamp: undefined,
        userId
    };
    try {
        if (medias) {
            yield Promise.all(medias.map((media) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (!media.filename) {
                        const ext = media.mimetype.split("/")[1].split(";")[0];
                        media.filename = `${new Date().getTime()}.${ext}`;
                    }
                    yield writeFileAsync((0, path_1.join)(__dirname, "..", "..", "..", "..", "public", media.filename), media.buffer, "base64");
                }
                catch (err) {
                    logger_1.logger.error(err);
                }
                const message = Object.assign(Object.assign({}, messageData), { mediaUrl: media.filename, mediaType: media.mimetype.substr(0, media.mimetype.indexOf("/")) });
                const msgCreated = yield MessageOffLine_1.default.create(message);
                const messageCreated = yield MessageOffLine_1.default.findByPk(msgCreated.id, {
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
                    ]
                });
                if (!messageCreated) {
                    throw new Error("ERR_CREATING_MESSAGE");
                }
                io.to(`${tenantId}-${messageCreated.ticketId.toString()}`)
                    .to(`${tenantId}-${messageCreated.ticket.status}`)
                    .to(`${tenantId}-notification`)
                    .emit(`${tenantId}-appMessage`, {
                    action: "create",
                    message: messageCreated,
                    ticket: messageCreated.ticket,
                    contact: messageCreated.ticket.contact
                });
                yield ticket.update({
                    lastMessage: messageCreated.body,
                    lastMessageAt: new Date().getTime()
                });
            })));
        }
        else {
            const msgCreated = yield MessageOffLine_1.default.create(Object.assign(Object.assign({}, messageData), { mediaType: "chat" }));
            const messageCreated = yield MessageOffLine_1.default.findByPk(msgCreated.id, {
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
                ]
            });
            if (!messageCreated) {
                // throw new AppError("ERR_CREATING_MESSAGE", 501);
                throw new Error("ERR_CREATING_MESSAGE");
            }
            yield ticket.update({
                lastMessage: messageCreated.body,
                lastMessageAt: new Date().getTime()
            });
            io.to(`${tenantId}-${messageCreated.ticketId.toString()}`)
                .to(`${tenantId}-${messageCreated.ticket.status}`)
                .to(`${tenantId}-notification`)
                .emit(`${tenantId}-appMessage`, {
                action: "create",
                message: messageCreated,
                ticket: messageCreated.ticket,
                contact: messageCreated.ticket.contact
            });
        }
    }
    catch (error) {
        logger_1.logger.error("CreateMessageOffLineService", error);
    }
});
exports.default = CreateMessageOffilineService;
//# sourceMappingURL=CreateMessageOfflineService.js.map