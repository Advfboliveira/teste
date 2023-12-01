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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const socket_1 = require("../../libs/socket");
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const logger_1 = require("../../utils/logger");
const CreateWhatsAppService = ({ name, status = "DISCONNECTED", tenantId, tokenTelegram, instagramUser, instagramKey, type, wabaBSP, tokenAPI, fbPageId, farewellMessage, isDefault = false }) => __awaiter(void 0, void 0, void 0, function* () {
    if (type === "waba" && (!tokenAPI || !wabaBSP)) {
        throw new AppError_1.default("WABA: favor informar o Token e a BSP");
    }
    if (type === "instagram" && !instagramUser) {
        throw new AppError_1.default("Instagram: favor informar o Usuário e senha corretamente.");
    }
    if (type === "telegram" && !tokenTelegram) {
        throw new AppError_1.default("Telegram: favor informar o Token.");
    }
    const whatsappFound = yield Whatsapp_1.default.findOne({
        where: { tenantId, isDefault: true }
    });
    if (!whatsappFound) {
        isDefault = !whatsappFound;
    }
    if (isDefault) {
        if (whatsappFound) {
            yield whatsappFound.update({ isDefault: false });
        }
    }
    try {
        const whatsapp = yield Whatsapp_1.default.create({
            name,
            status,
            isDefault,
            tenantId,
            tokenTelegram,
            instagramUser,
            instagramKey,
            type,
            wabaBSP,
            tokenAPI,
            fbPageId,
            farewellMessage
        });
        const io = (0, socket_1.getIO)();
        io.emit(`${tenantId}:whatsapp`, {
            action: "update",
            whatsapp
        });
        return { whatsapp, oldDefaultWhatsapp: whatsappFound };
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new AppError_1.default("ERR_CREATE_WAPP", 404);
    }
});
exports.default = CreateWhatsAppService;
//# sourceMappingURL=CreateWhatsAppService.js.map