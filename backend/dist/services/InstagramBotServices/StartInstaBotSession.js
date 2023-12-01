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
exports.StartInstaBotSession = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const InstaBot_1 = require("../../libs/InstaBot");
const socket_1 = require("../../libs/socket");
const logger_1 = require("../../utils/logger");
const InstaBotMessageListener_1 = require("./InstaBotMessageListener");
const InstagramSendMessagesSystem_1 = __importDefault(require("./InstagramSendMessagesSystem"));
const checkingInstagram = {};
const checkMessages = (instaBot, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    if (checkingInstagram[tenantId])
        return;
    checkingInstagram[tenantId] = true;
    try {
        yield (0, InstagramSendMessagesSystem_1.default)(instaBot, tenantId);
    }
    catch (error) {
        logger_1.logger.error(`ERROR: checkMessages Tenant: ${tenantId}::`, error);
    }
    checkingInstagram[tenantId] = false;
});
const StartInstaBotSession = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const io = (0, socket_1.getIO)();
    yield connection.update({ status: "OPENING" });
    io.emit(`${connection.tenantId}:whatsappSession`, {
        action: "update",
        session: connection
    });
    try {
        const instaBot = yield (0, InstaBot_1.initInstaBot)(connection);
        (0, InstaBotMessageListener_1.InstaBotMessageListener)(instaBot);
        setInterval(checkMessages, +(process.env.CHECK_INTERVAL || 5000), instaBot, connection.tenantId);
        logger_1.logger.info(`Conexão Instagram iniciada | Empresa: ${connection.tenantId}`);
        yield connection.update({ status: "CONNECTED" });
        io.emit(`${connection.tenantId}:whatsappSession`, {
            action: "update",
            session: connection
        });
    }
    catch (err) {
        logger_1.logger.error(`StartInstaBotSession | Error: ${err}`);
        yield connection.update({ status: "DISCONNECTED" });
        io.emit(`${connection.tenantId}:whatsappSession`, {
            action: "update",
            session: connection
        });
        throw new AppError_1.default(`ERROR_CONNECT_INSTAGRAM: ${err}`, 404);
    }
});
exports.StartInstaBotSession = StartInstaBotSession;
//# sourceMappingURL=StartInstaBotSession.js.map