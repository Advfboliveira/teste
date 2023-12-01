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
const util_1 = require("util");
const fs_1 = require("fs");
const VerifyQuotedMessage_1 = __importDefault(require("./VerifyQuotedMessage"));
const CreateMessageService_1 = __importDefault(require("../../MessageServices/CreateMessageService"));
const logger_1 = require("../../../utils/logger");
const writeFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const VerifyMediaMessage = (msg, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    const quotedMsg = yield (0, VerifyQuotedMessage_1.default)(msg);
    const media = yield msg.downloadMedia();
    if (!media) {
        logger_1.logger.error(`ERR_WAPP_DOWNLOAD_MEDIA:: ID: ${msg.id.id}`);
        return;
    }
    if (!media.filename) {
        const ext = media.mimetype.split("/")[1].split(";")[0];
        media.filename = `${new Date().getTime()}.${ext}`;
    }
    try {
        yield writeFileAsync((0, path_1.join)(__dirname, "..", "..", "..", "..", "public", media.filename), media.data, "base64");
    }
    catch (err) {
        logger_1.logger.error(err);
    }
    const messageData = {
        messageId: msg.id.id,
        ticketId: ticket.id,
        contactId: msg.fromMe ? undefined : contact.id,
        body: msg.body || media.filename,
        fromMe: msg.fromMe,
        read: msg.fromMe,
        mediaUrl: media.filename,
        mediaType: media.mimetype.split("/")[0],
        quotedMsgId: quotedMsg === null || quotedMsg === void 0 ? void 0 : quotedMsg.id,
        timestamp: msg.timestamp,
        status: msg.fromMe ? "sended" : "received"
    };
    yield ticket.update({
        lastMessage: msg.body || media.filename,
        lastMessageAt: new Date().getTime(),
        answered: msg.fromMe || false
    });
    const newMessage = yield (0, CreateMessageService_1.default)({
        messageData,
        tenantId: ticket.tenantId
    });
    return newMessage;
});
exports.default = VerifyMediaMessage;
//# sourceMappingURL=VerifyMediaMessage.js.map