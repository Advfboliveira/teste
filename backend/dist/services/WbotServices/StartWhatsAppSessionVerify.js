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
exports.StartWhatsAppSessionVerify = void 0;
const wbot_1 = require("../../libs/wbot");
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const wbotMessageListener_1 = require("./wbotMessageListener");
const socket_1 = require("../../libs/socket");
const wbotMonitor_1 = __importDefault(require("./wbotMonitor"));
const logger_1 = require("../../utils/logger");
const StartWhatsAppSessionVerify = (whatsappId, error) => __awaiter(void 0, void 0, void 0, function* () {
    const errorString = error.toString().toLowerCase();
    const sessionClosed = "session closed";
    const sessiondisconnected = "TypeError: Cannot read property 'sendSeen' of undefined";
    const WAPP_NOT_INIT = "ERR_WAPP_NOT_INITIALIZED".toLowerCase();
    if (errorString.indexOf(sessionClosed) !== -1 ||
        errorString.indexOf(WAPP_NOT_INIT) !== -1 ||
        errorString.indexOf(sessiondisconnected) !== -1) {
        const whatsapp = yield Whatsapp_1.default.findByPk(whatsappId);
        try {
            if (whatsapp) {
                yield whatsapp.update({ status: "OPENING" });
                const io = (0, socket_1.getIO)();
                io.emit(`${whatsapp === null || whatsapp === void 0 ? void 0 : whatsapp.tenantId}:whatsappSession`, {
                    action: "update",
                    session: whatsapp
                });
                const wbot = yield (0, wbot_1.initWbot)(whatsapp);
                (0, wbotMessageListener_1.wbotMessageListener)(wbot);
                (0, wbotMonitor_1.default)(wbot, whatsapp);
            }
        }
        catch (err) {
            logger_1.logger.error(err);
        }
    }
});
exports.StartWhatsAppSessionVerify = StartWhatsAppSessionVerify;
//# sourceMappingURL=StartWhatsAppSessionVerify.js.map