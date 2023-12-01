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
exports.StartWhatsAppSession = void 0;
const wbot_1 = require("../../libs/wbot");
const wbotMessageListener_1 = require("./wbotMessageListener");
const socket_1 = require("../../libs/socket");
const wbotMonitor_1 = __importDefault(require("./wbotMonitor"));
const logger_1 = require("../../utils/logger");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const StartInstaBotSession_1 = require("../InstagramBotServices/StartInstaBotSession");
const StartTbotSession_1 = require("../TbotServices/StartTbotSession");
const StartWaba360_1 = require("../WABA360/StartWaba360");
const StartMessengerBot_1 = require("../MessengerChannelServices/StartMessengerBot");
const StartWhatsAppSession = (whatsapp) => __awaiter(void 0, void 0, void 0, function* () {
    yield whatsapp.update({ status: "OPENING" });
    const io = (0, socket_1.getIO)();
    io.emit(`${whatsapp.tenantId}:whatsappSession`, {
        action: "update",
        session: whatsapp
    });
    try {
        if (whatsapp.type === "whatsapp") {
            const wbot = yield (0, wbot_1.initWbot)(whatsapp);
            (0, wbotMessageListener_1.wbotMessageListener)(wbot);
            (0, wbotMonitor_1.default)(wbot, whatsapp);
        }
        if (whatsapp.type === "telegram") {
            (0, StartTbotSession_1.StartTbotSession)(whatsapp);
        }
        if (whatsapp.type === "instagram") {
            (0, StartInstaBotSession_1.StartInstaBotSession)(whatsapp);
        }
        if (whatsapp.type === "messenger") {
            (0, StartMessengerBot_1.StartMessengerBot)(whatsapp);
        }
        if (whatsapp.type === "waba") {
            if (whatsapp.wabaBSP === "360") {
                (0, StartWaba360_1.StartWaba360)(whatsapp);
            }
        }
    }
    catch (err) {
        logger_1.logger.error(`StartWhatsAppSession | Error: ${err}`);
        throw new AppError_1.default("ERR_START_SESSION", 404);
    }
});
exports.StartWhatsAppSession = StartWhatsAppSession;
//# sourceMappingURL=StartWhatsAppSession.js.map