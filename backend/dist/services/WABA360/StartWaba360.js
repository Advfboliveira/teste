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
exports.StartWaba360 = void 0;
/* eslint-disable camelcase */
const AppError_1 = __importDefault(require("../../errors/AppError"));
const socket_1 = require("../../libs/socket");
const logger_1 = require("../../utils/logger");
// import GetRegisteredPhone from "./GetRegisteredPhone";
const SetWebHookUrl_1 = __importDefault(require("./SetWebHookUrl"));
const Waba360SendMessagesSystem_1 = __importDefault(require("./Waba360SendMessagesSystem"));
const checkingWaba360 = {};
const checkMessagesWaba360 = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    if (checkingWaba360[connection.tenantId])
        return;
    checkingWaba360[connection.tenantId] = true;
    try {
        yield (0, Waba360SendMessagesSystem_1.default)(connection);
    }
    catch (error) {
        logger_1.logger.error(`ERROR: checkMessages Tenant: ${connection.tenantId}::`, error);
    }
    checkingWaba360[connection.tenantId] = false;
});
const StartWaba360 = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const io = (0, socket_1.getIO)();
    yield connection.update({ status: "OPENING" });
    io.emit(`${connection.tenantId}:whatsappSession`, {
        action: "update",
        session: connection
    });
    try {
        yield (0, SetWebHookUrl_1.default)({
            // eslint-disable-next-line no-bitwise
            url: connection.UrlWabaWebHook || "",
            apiKey: connection.tokenAPI
        });
        const phoneNumber = ""; // await GetRegisteredPhone(connection.tokenAPI);
        logger_1.logger.info(`Conexão Waba 360 iniciada | Empresa: ${connection.tenantId}`);
        yield connection.update({ status: "CONNECTED", number: phoneNumber });
        setInterval(checkMessagesWaba360, +(process.env.CHECK_INTERVAL || 5000), connection);
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
exports.StartWaba360 = StartWaba360;
//# sourceMappingURL=StartWaba360.js.map