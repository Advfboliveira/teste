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
// import path from "path";
// import { rmdir } from "fs/promises";
const wbot_1 = require("../libs/wbot");
const ShowWhatsAppService_1 = __importDefault(require("../services/WhatsappService/ShowWhatsAppService"));
const StartWhatsAppSession_1 = require("../services/WbotServices/StartWhatsAppSession");
const UpdateWhatsAppService_1 = __importDefault(require("../services/WhatsappService/UpdateWhatsAppService"));
const redisClient_1 = require("../libs/redisClient");
const logger_1 = require("../utils/logger");
const tbot_1 = require("../libs/tbot");
const InstaBot_1 = require("../libs/InstaBot");
const AppError_1 = __importDefault(require("../errors/AppError"));
const socket_1 = require("../libs/socket");
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { whatsappId } = req.params;
    const { tenantId } = req.user;
    const whatsapp = yield (0, ShowWhatsAppService_1.default)({
        id: whatsappId,
        tenantId,
        isInternal: true
    });
    (0, StartWhatsAppSession_1.StartWhatsAppSession)(whatsapp);
    return res.status(200).json({ message: "Starting session." });
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { whatsappId } = req.params;
    const { isQrcode } = req.body;
    const { tenantId } = req.user;
    if (isQrcode) {
        yield (0, wbot_1.apagarPastaSessao)(whatsappId);
    }
    const { whatsapp } = yield (0, UpdateWhatsAppService_1.default)({
        whatsappId,
        whatsappData: { session: "" },
        tenantId
    });
    // await apagarPastaSessao(whatsappId);
    (0, StartWhatsAppSession_1.StartWhatsAppSession)(whatsapp);
    return res.status(200).json({ message: "Starting session." });
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { whatsappId } = req.params;
    const { tenantId } = req.user;
    const channel = yield (0, ShowWhatsAppService_1.default)({ id: whatsappId, tenantId });
    const io = (0, socket_1.getIO)();
    try {
        if (channel.type === "whatsapp") {
            const wbot = (0, wbot_1.getWbot)(channel.id);
            yield (0, redisClient_1.setValue)(`${channel.id}-retryQrCode`, 0);
            yield wbot
                .logout()
                .catch(error => logger_1.logger.error("Erro ao fazer logout da conexão", error)); // --> fecha o client e conserva a sessão para reconexão (criar função desconectar)
            (0, wbot_1.removeWbot)(channel.id);
            // await wbot
            //   .destroy()
            //   .catch(error => logger.error("Erro ao destuir conexão", error)); // --> encerra a sessão e desconecta o bot do whatsapp, geando um novo QRCODE
        }
        if (channel.type === "telegram") {
            const tbot = (0, tbot_1.getTbot)(channel.id);
            yield tbot.telegram
                .logOut()
                .catch(error => logger_1.logger.error("Erro ao fazer logout da conexão", error));
            (0, tbot_1.removeTbot)(channel.id);
        }
        if (channel.type === "instagram") {
            const instaBot = (0, InstaBot_1.getInstaBot)(channel.id);
            yield instaBot.destroy();
            (0, InstaBot_1.removeInstaBot)(channel);
        }
        yield channel.update({
            status: "DISCONNECTED",
            session: "",
            qrcode: null,
            retries: 0
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        yield channel.update({
            status: "DISCONNECTED",
            session: "",
            qrcode: null,
            retries: 0
        });
        io.emit(`${channel.tenantId}:whatsappSession`, {
            action: "update",
            session: channel
        });
        throw new AppError_1.default("ERR_NO_WAPP_FOUND", 404);
    }
    return res.status(200).json({ message: "Session disconnected." });
});
exports.default = { store, remove, update };
//# sourceMappingURL=WhatsAppSessionController.js.map