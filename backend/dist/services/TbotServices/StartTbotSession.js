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
exports.StartTbotSession = void 0;
const socket_1 = require("../../libs/socket");
const tbot_1 = require("../../libs/tbot");
const logger_1 = require("../../utils/logger");
const tbotMessageListener_1 = require("./tbotMessageListener");
const TelegramSendMessagesSystem_1 = __importDefault(require("./TelegramSendMessagesSystem"));
const checkingTelegram = {};
const checkMessages = (tbot, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    if (checkingTelegram[tenantId])
        return;
    checkingTelegram[tenantId] = true;
    try {
        yield (0, TelegramSendMessagesSystem_1.default)(tbot, tenantId);
        // Queue.add("SendMessages", { sessionId: wbot.id, tenantId });
    }
    catch (error) {
        logger_1.logger.error(`ERROR: checkMessages Tenant: ${tenantId}::`, error);
    }
    checkingTelegram[tenantId] = false;
});
const StartTbotSession = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const io = (0, socket_1.getIO)();
    yield connection.update({ status: "OPENING" });
    io.emit(`${connection.tenantId}:whatsappSession`, {
        action: "update",
        session: connection
    });
    try {
        const tbot = yield (0, tbot_1.initTbot)(connection);
        (0, tbotMessageListener_1.tbotMessageListener)(tbot);
        setInterval(checkMessages, +(process.env.CHECK_INTERVAL || 5000), tbot, connection.tenantId);
    }
    catch (err) {
        logger_1.logger.error(`StartTbotSession | Error: ${err}`);
    }
});
exports.StartTbotSession = StartTbotSession;
//# sourceMappingURL=StartTbotSession.js.map