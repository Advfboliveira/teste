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
/* eslint-disable @typescript-eslint/no-explicit-any */
const path_1 = require("path");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const logger_1 = require("../utils/logger");
const wbot_1 = require("../libs/wbot");
const CampaignContacts_1 = __importDefault(require("../models/CampaignContacts"));
exports.default = {
    key: "SendMessageWhatsappCampaign",
    options: {
        delay: 15000,
        attempts: 10,
        backoff: {
            type: "fixed",
            delay: 60000 * 5 // 5 min
        }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handle({ data }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /// feito por está apresentando problema com o tipo
                const wbot = (0, wbot_1.getWbot)(data.whatsappId);
                let message = {};
                if (data.mediaUrl) {
                    const customPath = (0, path_1.join)(__dirname, "..", "..", "public");
                    const mediaPath = (0, path_1.join)(customPath, data.mediaName);
                    const newMedia = whatsapp_web_js_1.MessageMedia.fromFilePath(mediaPath);
                    message = yield wbot.sendMessage(`${data.number}@c.us`, newMedia, {
                        sendAudioAsVoice: true,
                        caption: data.message
                    });
                }
                else {
                    message = yield wbot.sendMessage(`${data.number}@c.us`, data.message, {
                        linkPreview: false
                    });
                }
                yield CampaignContacts_1.default.update({
                    messageId: message.id.id,
                    messageRandom: data.messageRandom,
                    body: data.message,
                    mediaName: data.mediaName,
                    timestamp: message.timestamp,
                    jobId: data.jobId
                }, { where: { id: data.campaignContact.id } });
                return message;
            }
            catch (error) {
                logger_1.logger.error(`Error enviar message campaign: ${error}`);
                throw new Error(error);
            }
        });
    }
};
//# sourceMappingURL=SendMessageWhatsappCampaign.js.map