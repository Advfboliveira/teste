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
const axios_1 = __importDefault(require("axios"));
const CreateMessageService_1 = __importDefault(require("../MessageServices/CreateMessageService"));
const logger_1 = require("../../utils/logger");
const getQuotedForMessageId_1 = __importDefault(require("../../helpers/getQuotedForMessageId"));
const writeFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const getMediaInfo = (msg) => {
    // eslint-disable-next-line prettier/prettier
    const mediaType = msg.photo ? "photo" : msg.video ? "video" : msg.audio ? "audio" : msg.voice ? "voice" : msg.sticker && !msg.sticker.is_animated ? "sticker" : "document";
    const mediaObj = msg[mediaType];
    // eslint-disable-next-line prettier/prettier
    const [type, mimeType, SAD, fileName, fileId, caption, SAV] = [mediaType, mediaObj.mime_type ? mediaObj.mime_type : "", false, null, mediaObj.file_id ? mediaObj.file_id : mediaObj[mediaObj.length - 1].file_id, msg.caption ? msg.caption : "", mediaType == "voice"];
    switch (mediaType) {
        case "photo":
            return {
                type,
                mimeType: "image/png",
                SAD,
                fileName,
                fileId,
                caption,
                SAV
            };
            break;
        case "video":
            return { type, mimeType, SAD, fileName, fileId, caption, SAV };
            break;
        case "audio":
            return { type, mimeType, SAD, fileName, fileId, caption, SAV };
            break;
        case "voice":
            return { type, mimeType, SAD, fileName, fileId, caption, SAV };
            break;
        case "sticker":
            return {
                type,
                mimeType: "image/webp",
                SAD,
                fileName,
                fileId,
                caption,
                SAV,
                SAS: true
            };
            break;
        default:
            return {
                type,
                mimeType,
                SAD: true,
                fileName: mediaObj.file_name ? mediaObj.file_name : null,
                fileId,
                caption,
                SAV
            };
            break;
    }
};
const downloadFile = (url, pathFile) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, axios_1.default)({
        url: url.toString(),
        method: "GET",
        responseType: "stream"
    });
    // const writer = createWriteStream(pathFile);
    yield new Promise((resolve, reject) => {
        request.data
            .pipe((0, fs_1.createWriteStream)(pathFile))
            .on("finish", () => __awaiter(void 0, void 0, void 0, function* () { return resolve(true); }))
            .on("error", (error) => {
            console.error("ERROR DONWLOAD", error);
            // fs.rmdirSync(mediaDir, { recursive: true });
            reject(new Error(error));
        });
    });
});
const VerifyMediaMessage = (ctx, fromMe, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let message;
    let updateMessage = {};
    message = ctx === null || ctx === void 0 ? void 0 : ctx.message;
    updateMessage = ctx === null || ctx === void 0 ? void 0 : ctx.update;
    // Verificar se mensagem foi editada.
    if (!message && updateMessage) {
        message = updateMessage === null || updateMessage === void 0 ? void 0 : updateMessage.edited_message;
    }
    // const quotedMsg = await VerifyQuotedMessage(msg);
    const mediaInfo = yield getMediaInfo(message);
    const media = yield ctx.telegram.getFile(mediaInfo.fileId);
    if (!media) {
        logger_1.logger.error(`ERR_DOWNLOAD_MEDIA:: ID: ${message.message_id}`);
        return;
    }
    const ext = mediaInfo.mimeType.split("/")[1].split(";")[0];
    const filename = `${media.file_id}_${new Date().getTime()}.${ext}`;
    const pathFile = (0, path_1.join)(__dirname, "..", "..", "..", "public", filename);
    const linkDownload = yield ctx.telegram.getFileLink(mediaInfo.fileId);
    yield downloadFile(linkDownload, pathFile);
    let quotedMsgId;
    if ((_a = message === null || message === void 0 ? void 0 : message.reply_to_message) === null || _a === void 0 ? void 0 : _a.message_id) {
        const messageQuoted = yield (0, getQuotedForMessageId_1.default)(message.reply_to_message.message_id, ticket.tenantId);
        quotedMsgId = (messageQuoted === null || messageQuoted === void 0 ? void 0 : messageQuoted.id) || undefined;
    }
    const messageData = {
        messageId: String(message === null || message === void 0 ? void 0 : message.message_id),
        ticketId: ticket.id,
        contactId: fromMe ? undefined : contact.id,
        body: message.text || message.caption || filename,
        fromMe,
        read: fromMe,
        mediaUrl: filename,
        mediaType: mediaInfo.mimeType.split("/")[0],
        quotedMsgId,
        timestamp: +message.date * 1000,
        status: fromMe ? "sended" : "received"
    };
    yield ticket.update({
        lastMessage: message.text || message.caption || filename,
        lastMessageAt: new Date().getTime(),
        answered: fromMe || false
    });
    const newMessage = yield (0, CreateMessageService_1.default)({
        messageData,
        tenantId: ticket.tenantId
    });
    return newMessage;
});
exports.default = VerifyMediaMessage;
//# sourceMappingURL=TelegramVerifyMediaMessage.js.map