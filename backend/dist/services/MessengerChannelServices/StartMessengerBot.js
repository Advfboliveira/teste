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
exports.StartMessengerBot = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const messengerBot_1 = require("../../libs/messengerBot");
const socket_1 = require("../../libs/socket");
const logger_1 = require("../../utils/logger");
const MessengerSendMessagesSystem_1 = __importDefault(require("./MessengerSendMessagesSystem"));
const checkingMessenger = {};
const messengerCheckMessages = (messengerBot, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    if (checkingMessenger[tenantId])
        return;
    checkingMessenger[tenantId] = true;
    try {
        // await Waba360SendMessagesSystem(connection);
        yield (0, MessengerSendMessagesSystem_1.default)(messengerBot, tenantId);
    }
    catch (error) {
        logger_1.logger.error(`ERROR Messenger: checkMessages Tenant: ${tenantId}::`, error);
    }
    checkingMessenger[tenantId] = false;
});
const StartMessengerBot = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const io = (0, socket_1.getIO)();
    yield connection.update({ status: "OPENING" });
    io.emit(`${connection.tenantId}:whatsappSession`, {
        action: "update",
        session: connection
    });
    try {
        const phoneNumber = ""; // await GetRegisteredPhone(connection.tokenAPI);
        logger_1.logger.info(`Conexão Messenger iniciada | Empresa: ${connection.tenantId}`);
        const messengerBot = yield (0, messengerBot_1.initMessengerBot)(connection);
        yield connection.update({ status: "CONNECTED", number: phoneNumber });
        setInterval(messengerCheckMessages, +(process.env.CHECK_INTERVAL || 5000), messengerBot, connection.tenantId);
        io.emit(`${connection.tenantId}:whatsappSession`, {
            action: "update",
            session: connection
        });
    }
    catch (err) {
        logger_1.logger.error(`SetWebHookUrl 360 | Error: ${err}`);
        yield connection.update({ status: "DISCONNECTED" });
        io.emit(`${connection.tenantId}:whatsappSession`, {
            action: "update",
            session: connection
        });
        throw new AppError_1.default(`ERROR_CONNECT_WABA_360: ${err}`, 404);
    }
});
exports.StartMessengerBot = StartMessengerBot;
//# sourceMappingURL=StartMessengerBot.js.map