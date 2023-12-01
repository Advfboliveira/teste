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
const path_1 = require("path");
const fs_1 = require("fs");
const axios_1 = __importDefault(require("axios"));
const CreateMessageService_1 = __importDefault(require("../MessageServices/CreateMessageService"));
const getExt = (url) => {
    const n = url.split("?");
    const m = n[0].split("/");
    const s = m[m.length - 1].split(".");
    return s[1];
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // const quotedMsg = await VerifyQuotedMessage(msg);
    let mediaInfo;
    let media;
    let ext;
    let mediaType = "application";
    let type = "arquivo";
    if (((_b = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.media_type) === 1) {
        media = ctx.message.media;
        [mediaInfo] = ctx.message.media.image_versions2.candidates;
        ext = getExt(mediaInfo.url);
        mediaType = "image";
        type = "imagem";
    }
    if (((_d = (_c = ctx.message) === null || _c === void 0 ? void 0 : _c.media) === null || _d === void 0 ? void 0 : _d.media_type) === 2) {
        media = ctx.message.media;
        [mediaInfo] = ctx.message.media.video_versions;
        ext = getExt(mediaInfo.url);
        mediaType = "video";
        type = "vídeo";
    }
    if (((_e = ctx.message) === null || _e === void 0 ? void 0 : _e.item_type) === "voice_media") {
        media = ctx.message.voice_media.media;
        mediaInfo = ctx.message.voice_media.media.audio;
        ext = getExt(mediaInfo.audio_src);
        mediaType = "audio";
        type = "áudio";
    }
    const filename = `${ticket.id}_${media.id}_${new Date().getTime()}.${ext}`;
    const pathFile = (0, path_1.join)(__dirname, "..", "..", "..", "public", filename);
    const linkDownload = ctx.message.item_type === "voice_media"
        ? mediaInfo.audio_src
        : mediaInfo.url;
    yield downloadFile(linkDownload, pathFile);
    // const media = await ctx.telegram.getFile(ctx.message?.);
    // logger.error(err);
    const messageData = {
        messageId: String((_f = ctx.message) === null || _f === void 0 ? void 0 : _f.item_id),
        ticketId: ticket.id,
        contactId: fromMe ? undefined : contact.id,
        body: ((_g = ctx.message) === null || _g === void 0 ? void 0 : _g.text) || ((_h = ctx.message) === null || _h === void 0 ? void 0 : _h.caption) || type,
        fromMe,
        read: fromMe,
        mediaUrl: filename,
        mediaType,
        quotedMsgId: "",
        timestamp: new Date().getTime(),
        status: fromMe ? "sended" : "received"
    };
    yield ticket.update({
        lastMessage: ((_j = ctx.message) === null || _j === void 0 ? void 0 : _j.text) || ((_k = ctx.message) === null || _k === void 0 ? void 0 : _k.caption) || type,
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
//# sourceMappingURL=InstagramVerifyMediaMessage.js.map