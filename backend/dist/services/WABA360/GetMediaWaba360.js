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
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const path_1 = require("path");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const logger_1 = require("../../utils/logger");
const downloadFile = (apiKey, wabaMediaId, filename) => __awaiter(void 0, void 0, void 0, function* () {
    const apiUrl360 = `${process.env.API_URL_360}/v1/media/${wabaMediaId}`;
    const pathFile = (0, path_1.join)(__dirname, "..", "..", "public", filename);
    const request = yield (0, axios_1.default)({
        url: apiUrl360,
        method: "GET",
        responseType: "stream",
        headers: {
            "D360-API-KEY": apiKey
        }
    });
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
// Use this endpoint get media waba.
const GetMediaWaba360 = ({ channel, msg, ticket }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mediaId = "";
        let originalName;
        let mime_type;
        if (msg === null || msg === void 0 ? void 0 : msg.document) {
            mediaId = msg.document.id || "";
            originalName = msg.document.filename;
            mime_type = msg.document.mime_type;
        }
        if (msg === null || msg === void 0 ? void 0 : msg.image) {
            mediaId = msg.image.id || "";
            mime_type = msg.image.mime_type;
        }
        if (msg === null || msg === void 0 ? void 0 : msg.video) {
            mediaId = msg.video.id || "";
            mime_type = msg.video.mime_type;
        }
        if (msg === null || msg === void 0 ? void 0 : msg.voice) {
            mediaId = msg.voice.id || "";
            const mime = msg.voice.mime_type || "";
            // necessário para tratar "audio/ogg; codecs=opus"
            const mimeSplit = mime.split(";");
            mime_type = mimeSplit.length > 1 ? mimeSplit[0] : msg.voice.mime_type;
        }
        if (msg === null || msg === void 0 ? void 0 : msg.audio) {
            mediaId = msg.audio.id || "";
            mime_type = msg.audio.mime_type;
        }
        const ext = mime_type === null || mime_type === void 0 ? void 0 : mime_type.split("/")[1].split(";")[0];
        const time = new Date().getTime();
        const filename = originalName
            ? `${originalName}_${ticket.id}_${mediaId}_${time}.${ext}`
            : `${ticket.id}_${mediaId}_${time}.${ext}`;
        yield downloadFile(channel.tokenAPI, mediaId, filename);
        return filename;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new AppError_1.default(`360_NOT_DOWNLOAD_MEDIA: ${error}`);
    }
});
exports.default = GetMediaWaba360;
//# sourceMappingURL=GetMediaWaba360.js.map